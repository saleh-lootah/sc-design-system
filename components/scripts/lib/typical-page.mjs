/**
 * The typical page (test/perf/typical-page.html), served the way scripts/measure-runtime.mjs
 * and scripts/measure-bundle.mjs load it in headless Helium:
 *
 *   /perf?lang=en|ar&build=lazy|ce
 *
 * - English or Arabic: element text from data-ar, attribute values from data-ar-<attr>,
 *   swapped server-side so no script runs first.
 * - The lazy build with the documented snippet (modulepreload from dist/sc-components/
 *   sc-preload.json), or the custom-elements build as plain ESM imports (no bundler).
 * - Text responses gzipped, everything `no-store`.
 */
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { gzipSync } from 'node:zlib';

const TYPES = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.woff2': 'font/woff2', '.json': 'application/json', '.map': 'application/json' };
export const CE_TAGS = ['sc-page', 'sc-skip-link', 'sc-app-bar', 'sc-language-switch', 'sc-channel-hero', 'sc-search', 'sc-service-card'];

export function pageHtml(root, lang, build) {
  const template = readFileSync(join(root, 'test', 'perf', 'typical-page.html'), 'utf8');
  let html = template.replace(/<!--[\s\S]*?-->\n?/, '');
  if (lang === 'ar') {
    html = html.replace(/(<([a-z0-9-]+)\b[^>]*?data-ar="([^"]*)"[^>]*>)[^<]*(<\/\2>)/g, (_, open, _t, ar, close) => `${open}${ar}${close}`);
    html = html.replace(/\b([a-z-]+)="[^"]*" data-ar-\1="([^"]*)"/g, '$1="$2"');
  }
  const preloadFile = join(root, 'dist', 'sc-components', 'sc-preload.json');
  const preload = existsSync(preloadFile)
    ? (({ core, page }) => [core, ...page].map((f) => `<link rel="modulepreload" href="/dist/sc-components/${f}">`).join(''))(JSON.parse(readFileSync(preloadFile, 'utf8')))
    : '';
  const loader =
    build === 'lazy'
      ? `${preload}<script type="module" src="/dist/sc-components/sc-components.esm.js"></script>`
      : `<script type="module">\n${CE_TAGS.map((t) => `import '/dist/components/${t}.js';`).join('\n')}\n</script>`;
  return html.replace('{{lang}}', lang).replace('{{dir}}', lang === 'ar' ? 'rtl' : 'ltr').replace('{{loader}}', loader);
}

/** Starts the server on a free port. Resolves to { origin, close }. */
export async function serveTypicalPage(root) {
  const gzCache = new Map();
  const server = createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    if (url.pathname === '/perf') {
      res.writeHead(200, { 'content-type': 'text/html', 'cache-control': 'no-store' });
      return res.end(pageHtml(root, url.searchParams.get('lang') || 'en', url.searchParams.get('build') || 'lazy'));
    }
    const file = normalize(join(root, decodeURIComponent(url.pathname)));
    if (!file.startsWith(root) || !existsSync(file) || statSync(file).isDirectory()) {
      res.writeHead(404);
      return res.end();
    }
    const type = TYPES[extname(file)] || 'application/octet-stream';
    let body = readFileSync(file);
    const headers = { 'content-type': type, 'cache-control': 'no-store' };
    if (/gzip/.test(req.headers['accept-encoding'] || '') && /text|json/.test(type)) {
      if (!gzCache.has(file)) gzCache.set(file, gzipSync(body, { level: 9 }));
      body = gzCache.get(file);
      headers['content-encoding'] = 'gzip';
    }
    res.writeHead(200, headers);
    res.end(body);
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  return { origin: `http://127.0.0.1:${server.address().port}`, close: () => server.close() };
}

/**
 * The font files Helium actually downloads for the typical page, per language: loads the page
 * (lazy build), waits for every sc- element to render and for document.fonts.ready, then reads
 * the woff2 resource entries. Bytes are the files' own size (WOFF2 is already compressed).
 * Resolves to { en: { bytes, files: [{ file, bytes }] }, ar: { … } }.
 */
export async function typicalPageFonts(root, browserPath) {
  const { default: puppeteer } = await import('puppeteer');
  const { origin, close } = await serveTypicalPage(root);
  const browser = await puppeteer.launch({ executablePath: browserPath, headless: true, args: ['--hide-scrollbars', '--no-first-run', ...(process.env.CI ? ['--no-sandbox'] : [])] });
  const out = {};
  try {
    for (const lang of ['en', 'ar']) {
      const ctx = await browser.createBrowserContext();
      const page = await ctx.newPage();
      await page.setViewport({ width: 412, height: 915, deviceScaleFactor: 1 });
      await page.setCacheEnabled(false);
      await page.goto(`${origin}/perf?lang=${lang}&build=lazy`, { waitUntil: 'networkidle0', timeout: 60000 });
      const files = await page.evaluate(async () => {
        const all = [];
        const walk = (r) => r.querySelectorAll('*').forEach((el) => (el.localName.startsWith('sc-') && all.push(el), el.shadowRoot && walk(el.shadowRoot)));
        walk(document);
        await Promise.all(all.filter((el) => el.componentOnReady).map((el) => el.componentOnReady()));
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        await document.fonts.ready;
        return performance
          .getEntriesByType('resource')
          .filter((r) => /\.woff2(\?|$)/.test(r.name))
          .map((r) => ({ file: r.name.split('/').pop(), bytes: r.decodedBodySize }));
      });
      out[lang] = { bytes: files.reduce((n, f) => n + f.bytes, 0), files };
      await ctx.close();
    }
  } finally {
    await browser.close();
    close();
  }
  return out;
}
