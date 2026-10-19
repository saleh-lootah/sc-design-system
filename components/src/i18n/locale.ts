/**
 * Locale controller: gives a component its language, re-renders it when the language
 * changes, and translates strings.
 *
 *   import { LocaleController } from '../../i18n/locale';
 *
 *   export class ScThing {
 *     private locale = new LocaleController(this);
 *     connectedCallback() { this.locale.connect(); }
 *     disconnectedCallback() { this.locale.disconnect(); }
 *     render() { return <span>{this.locale.t('loading')}</span>; }
 *   }
 *
 * The language is the closest `lang` attribute, searched up the DOM and across shadow
 * boundaries (an element inside a shadow root inherits the language of its host).
 * One MutationObserver, shared by every component, watches `lang` and `dir` on the
 * document and on every shadow root a component sits in; when they change, each
 * component whose resolved language changed is re-rendered with forceUpdate().
 */
import { ComponentInterface, forceUpdate, getElement } from '@stencil/core';
import { Dir, FormatValues, Lang, StringKey, dirFor, toLang, translate } from './strings';

type Listener = () => void;

const listeners = new Set<Listener>();
const observedRoots = new WeakSet<Node>();
let observer: MutationObserver | undefined;

function observe(root: Node): void {
  if (typeof MutationObserver === 'undefined' || observedRoots.has(root)) return;
  observer ??= new MutationObserver(() => listeners.forEach((listener) => listener()));
  observedRoots.add(root);
  observer.observe(root, { attributes: true, attributeFilter: ['lang', 'dir'], subtree: true });
}

/** The parent to keep searching from: the shadow host when `node` is the top of a shadow tree. */
function hostOf(node: Element): Element | null {
  const root = typeof node.getRootNode === 'function' ? node.getRootNode() : null;
  return root && (root as ShadowRoot).host ? (root as ShadowRoot).host : null;
}

function closestAttr(el: Element, attr: 'lang' | 'dir'): string | null {
  let node: Element | null = el;
  while (node) {
    const found: Element | null = node.closest(`[${attr}]`);
    if (found) return found.getAttribute(attr);
    node = hostOf(node);
  }
  return null;
}

/** The language of an element: its closest `lang`, crossing shadow boundaries. */
export function resolveLang(el: Element): Lang {
  return toLang(closestAttr(el, 'lang'));
}

/** The direction of an element: its closest `dir`, else the direction of its language. */
export function resolveDir(el: Element): Dir {
  const dir = closestAttr(el, 'dir')?.toLowerCase();
  return dir === 'rtl' || dir === 'ltr' ? dir : dirFor(resolveLang(el));
}

export class LocaleController {
  /** The resolved language. Updated before each re-render. */
  lang: Lang = 'en';
  /** The resolved direction. Prefer CSS `:host(:dir(rtl))` for styling. */
  dir: Dir = 'ltr';

  private host?: HTMLElement;
  private readonly listener: Listener = () => this.refresh();

  /** @param component the Stencil component instance (`this`). */
  constructor(private readonly component: ComponentInterface) {}

  /** Call from connectedCallback(). Resolves the language before the first render. */
  connect(): void {
    this.host = getElement(this.component);
    this.read();
    listeners.add(this.listener);
    observe(this.host.ownerDocument ?? document);
    // Watch every shadow root between the host and the document.
    let node: Element | null = this.host;
    while (node) {
      const root = node.getRootNode?.();
      if (root && (root as ShadowRoot).host) observe(root);
      node = hostOf(node);
    }
  }

  /** Call from disconnectedCallback(). */
  disconnect(): void {
    listeners.delete(this.listener);
  }

  /** Translates a key in the component's language, filling `{placeholders}` from `values`. */
  t = (key: StringKey, values?: FormatValues): string => translate(this.lang, key, values);

  private read(): boolean {
    if (!this.host) return false;
    const lang = resolveLang(this.host);
    const dir = resolveDir(this.host);
    const changed = lang !== this.lang || dir !== this.dir;
    this.lang = lang;
    this.dir = dir;
    return changed;
  }

  private refresh(): void {
    if (this.read()) forceUpdate(this.component);
  }
}
