/**
 * Markdown for the documentation site, at build time only (markdown-it; nothing renders
 * Markdown in the browser).
 *
 * parseDoc() reads one document into tokens and annotates them:
 *   - every heading gets an id: its inline `<a id>` (removed from the text), else a GitHub-style
 *     slug, so links written for GitHub's renderer still resolve; a standalone `<a id>` line just
 *     before a heading becomes an alias of that heading;
 *   - a requirement definition (`**A11Y-04.` at the start of a list item or paragraph, or an ID
 *     alone in a table row's first cell) gets id="A11Y-04" and a link to itself;
 *   - with `split`, the document is cut into an intro and one chunk per `##` heading.
 * renderChunk() renders a chunk with every link resolved through the caller's `resolve()`,
 * auto-linking bare requirement IDs and wrapping tables and code in labelled scroll regions.
 */
import MarkdownIt from 'markdown-it';

export const md = new MarkdownIt({ html: true, linkify: false, typographer: false });

/** A requirement identifier: CMP-08, A11Y-23, LANG-22A, OQ-14. */
export const REQ = /\b([A-Z][A-Z0-9]{0,5}-\d{2,3}[A-Z]?)\b/g;
const REQ_START = /^([A-Z][A-Z0-9]{0,5}-\d{2,3}[A-Z]?)\.(?=\s|$)/;
const REQ_ALONE = /^\*{0,2}([A-Z][A-Z0-9]{0,5}-\d{2,3}[A-Z]?)\*{0,2}$/;
const ANCHOR_ONLY = /^\s*(<a id="[^"]+"><\/a>\s*)+$/;
const ANCHOR_IDS = /<a id="([^"]+)"><\/a>/g;
const HTML_IDS = /\sid="([^"]+)"/g;

export const escapeHtml = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** GitHub's heading slug (github-slugger): lowercase, drop punctuation, spaces to hyphens. */
export function ghSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu, '')
    .replace(/ /g, '-');
}

/** Plain text of an inline token (no Markdown syntax). */
export function inlineText(tok) {
  if (!tok?.children) return tok?.content ?? '';
  return tok.children
    .map((c) => (c.type === 'text' || c.type === 'code_inline' ? c.content : c.type === 'softbreak' || c.type === 'hardbreak' ? ' ' : ''))
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Parses and annotates one document.
 * @param o.splitAt  with split: the first chapter is the first `##` whose text matches this
 * @param o.splitParts with split: `###` headings that also start a page ("Part A · …")
 * @returns {{ title, chunks: Array<{ tokens, heading?: {id, text} }>, anchors: Map<id, chunkIndex>, aliases: Map<alias, id>, reqs: Array<{id, title, chunk, anchor}> }}
 */
export function parseDoc(src, { split = false, splitAt = null, splitParts = null } = {}) {
  const tokens = md.parse(src, {});
  const slugs = new Map();
  const uniqueSlug = (s) => {
    const n = slugs.get(s) ?? 0;
    slugs.set(s, n + 1);
    return n ? `${s}-${n}` : s;
  };
  const aliases = new Map(); // alias id -> canonical id
  const reqs = [];
  const drop = new Set();
  let title = '';

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];

    if (t.type === 'heading_open') {
      const inline = tokens[i + 1];
      let id;
      const kids = inline.children;
      // Leading `<a id="x"></a>` (one html_inline for the opening tag, one for the closing).
      while (kids.length && kids[0].type === 'html_inline' && /^<a id="[^"]+">$/.test(kids[0].content)) {
        const found = kids[0].content.match(/id="([^"]+)"/)[1];
        kids.shift();
        if (kids[0]?.type === 'html_inline' && kids[0].content === '</a>') kids.shift();
        if (id) aliases.set(found, id);
        else id = found;
      }
      if (kids[0]?.type === 'text') kids[0].content = kids[0].content.replace(/^\s+/, '');
      const text = inlineText(inline);
      // Standalone anchors just before the heading (skipping a rule) name it too.
      const before = [];
      for (let j = i - 1; j >= 0; j--) {
        const p = tokens[j];
        if (p.type === 'hr' || drop.has(j)) continue;
        if (p.type === 'html_block' && ANCHOR_ONLY.test(p.content)) {
          before.push(...[...p.content.matchAll(ANCHOR_IDS)].map((m) => m[1]));
          drop.add(j);
          continue;
        }
        // `<a id="x"></a>` alone on a line is a paragraph to CommonMark, not an HTML block.
        if (p.type === 'paragraph_close' && tokens[j - 1]?.type === 'inline' && ANCHOR_ONLY.test(tokens[j - 1].content) && tokens[j - 2]?.type === 'paragraph_open') {
          before.push(...[...tokens[j - 1].content.matchAll(ANCHOR_IDS)].map((m) => m[1]));
          drop.add(j).add(j - 1).add(j - 2);
          j -= 2;
          continue;
        }
        break;
      }
      for (const b of before) {
        if (!id) id = b;
        else if (b !== id) aliases.set(b, id);
      }
      const slug = uniqueSlug(ghSlug(text));
      if (!id) id = slug;
      else if (slug !== id) aliases.set(slug, id);
      t.attrSet('id', id);
      t.meta = { id, text, level: Number(t.tag.slice(1)) };
      if (t.tag === 'h1' && !title) title = text;
      continue;
    }

    if (t.type === 'inline' && t.children?.length) {
      // `**A11Y-04. Title.**` at the start of a paragraph.
      // markdown-it leaves an empty text token first.
      while (t.children[0]?.type === 'text' && t.children[0].content === '') t.children.shift();
      const [a, b] = t.children;
      if (a?.type === 'strong_open' && b?.type === 'text' && REQ_START.test(b.content)) {
        const id = b.content.match(REQ_START)[1];
        const host = tokens[i - 1]?.type === 'paragraph_open' && tokens[i - 2]?.type === 'list_item_open' ? tokens[i - 2] : tokens[i - 1];
        if (!host.attrGet('id')) {
          host.attrSet('id', id);
          host.attrJoin('class', 'req');
          // The ID becomes a link to itself, before the bold title, so it can hang in the margin
          // like a clause number; the bold text keeps the rest ("Target size.").
          const Token = t.children[0].constructor;
          const rest = b.content.slice(id.length).replace(/^\.\s*/, '');
          const link = Object.assign(new Token('link_open', 'a', 1), { attrs: [['href', `#${id}`], ['class', 'req-id']] });
          const idText = Object.assign(new Token('text', '', 0), { content: id });
          const close = new Token('link_close', 'a', -1);
          const space = Object.assign(new Token('text', '', 0), { content: ' ' });
          b.content = rest;
          // Title: the bold text after the ID, if it is a short label.
          let label = rest;
          for (let k = 2; k < t.children.length && t.children[k].type !== 'strong_close'; k++) label += t.children[k].content ?? '';
          label = label.replace(/\.$/, '').trim();
          // An ID with no title ("**A11Y-01.** Every page…") leaves an empty strong: drop it.
          const strongClose = t.children.findIndex((c) => c.type === 'strong_close');
          if (!label && strongClose === 2) t.children.splice(0, 3);
          t.children.unshift(link, idText, close, space);
          if (t.children[4]?.type === 'text' && !label) t.children[4].content = t.children[4].content.replace(/^\s+/, '');
          const plain = inlineText(t).slice(id.length).trim();
          reqs.push({ id, title: label || plain.slice(0, 140) + (plain.length > 140 ? '…' : ''), token: i });
        }
      }
      // An identifier alone in the first cell of a table row.
      if ((tokens[i - 1]?.type === 'td_open' || tokens[i - 1]?.type === 'th_open') && tokens[i - 2]?.type === 'tr_open') {
        const m = t.content.trim().match(REQ_ALONE);
        if (m && tokens[i - 1].type === 'td_open' && !tokens[i - 2].attrGet('id')) {
          tokens[i - 2].attrSet('id', m[1]);
          tokens[i - 2].attrJoin('class', 'req');
          let k = i + 1;
          while (k < tokens.length && tokens[k].type !== 'inline') k++;
          reqs.push({ id: m[1], title: inlineText(tokens[k]).slice(0, 140), token: i, table: true });
        }
      }
    }
  }

  const kept = tokens.map((t, i) => (drop.has(i) ? null : t));
  // Chunks: everything before the first `##`, then one per `##` (only when splitting).
  const chunks = [];
  let cur = { tokens: [], start: 0 };
  kept.forEach((t, i) => {
    if (!t) return;
    // With splitAt, unnumbered `##` sections before the first chapter (a summary, the contents)
    // stay in the intro.
    const chapter = t.type === 'heading_open' && t.tag === 'h2' && (!splitAt || splitAt.test(t.meta.text) || chunks.length || cur.heading);
    const part = splitParts && t.type === 'heading_open' && t.tag === 'h3' && cur.heading && splitParts.test(t.meta.text);
    if (split && (chapter || part)) {
      chunks.push(cur);
      cur = { tokens: [], start: i, heading: t.meta };
    }
    cur.tokens.push(t);
  });
  chunks.push(cur);
  // Rules between chapters belong to neither page.
  for (const c of chunks) while (c.tokens.length && c.tokens[c.tokens.length - 1].type === 'hr') c.tokens.pop();

  // Which chunk holds each id.
  const anchors = new Map();
  chunks.forEach((c, ci) => {
    for (const t of c.tokens) {
      const id = t.attrGet?.('id');
      if (id && !anchors.has(id)) anchors.set(id, ci);
      const html = t.type === 'html_block' || t.type === 'html_inline' ? t.content : '';
      for (const m of html.matchAll(HTML_IDS)) if (!anchors.has(m[1])) anchors.set(m[1], ci);
      for (const k of t.children ?? []) if (k.type === 'html_inline') for (const m of k.content.matchAll(HTML_IDS)) if (!anchors.has(m[1])) anchors.set(m[1], ci);
    }
  });
  for (const [alias, id] of aliases) if (!anchors.has(alias) && anchors.has(id)) anchors.set(alias, anchors.get(id));
  for (const r of reqs) r.chunk = anchors.get(r.id) ?? 0;

  return { title, chunks, anchors, aliases, reqs };
}

/** Headings inside a chunk, for the on-page contents. Levels are as rendered (after shifting). */
export function chunkHeadings(chunk, shift) {
  return chunk.tokens.filter((t) => t.type === 'heading_open').map((t) => ({ ...t.meta, level: t.meta.level - shift }));
}

/**
 * Renders a chunk to HTML.
 * @param chunk      from parseDoc
 * @param o.shift    heading levels to remove (1 makes `##` the page's h1)
 * @param o.resolve  (href) => href: rewrites every link (relative .md, #fragments, req:ID)
 * @param o.isReq    (id) => boolean: identifiers to auto-link
 * @param o.t        the page's strings
 */
export function renderChunk(chunk, { shift = 0, resolve, isReq, t }) {
  const tokens = chunk.tokens;
  let table = 0;
  let code = 0;
  let lastHeading = '';
  const env = {};
  const rules = md.renderer.rules;
  const saved = { ...rules };

  rules.heading_open = (tk, i) => {
    const h = tk[i];
    const level = Math.max(1, h.meta.level - shift);
    lastHeading = h.meta.text;
    const tag = `h${Math.min(level, 6)}`;
    h._rtag = tag;
    const wrap = level >= 2 && level <= 3;
    return `${wrap ? '<div class="doc-heading">' : ''}<${tag} id="${escapeHtml(h.meta.id)}">`;
  };
  rules.heading_close = (tk, i) => {
    let o = i;
    while (tk[o].type !== 'heading_open') o--;
    const h = tk[o];
    const level = Math.max(1, h.meta.level - shift);
    const close = `</${h._rtag}>`;
    if (level < 2 || level > 3) return `${close}\n`;
    return `${close}<a class="doc-heading__link" href="#${escapeHtml(h.meta.id)}"><span aria-hidden="true">#</span><span class="site-vh">${escapeHtml(t.linkToSection)} ${escapeHtml(h.meta.text)}</span></a></div>\n`;
  };
  rules.table_open = () => {
    table += 1;
    return `<div class="doc-scroll" role="region" tabindex="0" aria-label="${escapeHtml(t.tableLabel(table, lastHeading))}"><table>\n`;
  };
  rules.table_close = () => '</table></div>\n';
  rules.fence = (tk, i) => {
    code += 1;
    const info = tk[i].info.trim().split(/\s+/)[0];
    return `<div class="doc-scroll doc-code" role="region" tabindex="0" aria-label="${escapeHtml(t.codeLabel(code))}"><pre dir="ltr"><code${info ? ` data-lang="${escapeHtml(info)}"` : ''}>${escapeHtml(tk[i].content)}</code></pre></div>\n`;
  };
  rules.code_block = rules.fence;
  rules.code_inline = (tk, i) => `<code dir="ltr">${escapeHtml(tk[i].content)}</code>`;
  // Tokens are rendered once per language, so links are rewritten on output, never in place.
  rules.link_open = (tk, i) => {
    const out = resolve(tk[i].attrGet('href'));
    const attrs = tk[i].attrs
      .filter(([k]) => k !== 'href' && k !== 'class')
      .map(([k, v]) => ` ${k}="${escapeHtml(v)}"`)
      .join('');
    const cls = [tk[i].attrGet('class'), out.external && 'is-external'].filter(Boolean).join(' ');
    return `<a href="${escapeHtml(out.href)}"${cls ? ` class="${cls}"` : ''}${attrs}>`;
  };
  // Raw HTML in the documents can carry relative links too.
  const rewriteHtml = (html) => html.replace(/(<a\s[^>]*?href=")([^"]+)(")/g, (all, a, href, b) => a + escapeHtml(resolve(href.replace(/&amp;/g, '&')).href) + b);
  rules.html_block = (tk, i) => rewriteHtml(tk[i].content);
  rules.html_inline = (tk, i) => rewriteHtml(tk[i].content);

  // In text that is not already a link or a heading: bare requirement IDs become links, and the
  // keywords MUST, SHOULD and MAY get a weight change only (never a colour).
  const KEYWORD = /\b(MUST NOT|MUST|SHOULD NOT|SHOULD|MAY)\b/g;
  const work = tokens.map((tk, i) => {
    if (tk.type !== 'inline' || tokens[i - 1]?.type === 'heading_open' || !tk.children) return tk;
    const out = [];
    let inLink = 0;
    let inStrong = 0;
    for (const c of tk.children) {
      if (c.type === 'link_open') inLink++;
      if (c.type === 'link_close') inLink--;
      if (c.type === 'strong_open') inStrong++;
      if (c.type === 'strong_close') inStrong--;
      if (c.type !== 'text' || inLink) {
        out.push(c);
        continue;
      }
      const Token = c.constructor;
      const hits = [
        ...[...c.content.matchAll(REQ)].filter((m) => isReq(m[1])).map((m) => ({ at: m.index, len: m[0].length, req: m[1] })),
        ...(inStrong ? [] : [...c.content.matchAll(KEYWORD)].map((m) => ({ at: m.index, len: m[0].length, kw: m[1] }))),
      ].sort((x, y) => x.at - y.at);
      let last = 0;
      for (const h of hits) {
        if (h.at < last) continue;
        if (h.at > last) out.push(Object.assign(new Token('text', '', 0), { content: c.content.slice(last, h.at) }));
        if (h.req) {
          out.push(Object.assign(new Token('link_open', 'a', 1), { attrs: [['href', `req:${h.req}`], ['class', 'req-ref']] }));
          out.push(Object.assign(new Token('text', '', 0), { content: h.req }));
          out.push(new Token('link_close', 'a', -1));
        } else {
          out.push(Object.assign(new Token('html_inline', '', 0), { content: `<strong class="kw">${h.kw}</strong>` }));
        }
        last = h.at + h.len;
      }
      if (last < c.content.length) out.push(Object.assign(new Token('text', '', 0), { content: c.content.slice(last) }));
    }
    return Object.assign(Object.create(Object.getPrototypeOf(tk)), tk, { children: out });
  });

  const html = md.renderer.render(work, md.options, env);
  Object.assign(rules, saved);
  for (const k of Object.keys(rules)) if (!(k in saved)) delete rules[k];
  return html;
}

/** Plain-text sections of a chunk for the search index: one per heading of level ≤ 3. */
export function searchSections(chunk) {
  const out = [];
  let cur = null;
  for (let i = 0; i < chunk.tokens.length; i++) {
    const t = chunk.tokens[i];
    if (t.type === 'heading_open' && t.meta.level <= 4) {
      cur = { id: t.meta.id, title: t.meta.text, text: [] };
      out.push(cur);
      i++; // skip the heading's inline
      continue;
    }
    if (t.type === 'inline') {
      if (!cur) {
        cur = { id: null, title: null, text: [] };
        out.push(cur);
      }
      cur.text.push(inlineText(t));
    }
  }
  return out.map((s) => ({ ...s, text: s.text.join(' ').replace(/\s+/g, ' ').trim() }));
}
