/**
 * Shared building blocks for the v2 form-field family: sc-text-input, sc-textarea, sc-select,
 * sc-checkbox, sc-checkbox-group, sc-radio, sc-radio-group, sc-date-input, sc-date-range and
 * sc-search. Not a component: functional components and helpers each field imports. The
 * styles are in field.css (label, hint, error, frame, control) and choice.css (radios and
 * checkboxes), which each field lists in its `styleUrls` (no @import, CONVENTIONS.md).
 *
 * v2 fields render into LIGHT DOM (Stencil `scoped`, decision A2): the native <label>,
 * <input>/<textarea>/<select>, hint and error are children of the host. So:
 *   - IDs are generated per instance (`sc-text-input-3-control`), because they share the document;
 *   - the browser does the form work: submission, Enter-to-submit through the default button,
 *     FormData, constraint validation, reset, <fieldset disabled>, autofill;
 *   - rich label, hint and error content is a child with `slot="label|hint|error"`, which the
 *     component MOVES into place once (`takeSlotted` + `Moved`), since scoped components only
 *     relocate the default slot reliably (architecture §3.1).
 */
import { FunctionalComponent, h } from '@stencil/core';
import type { StringPart } from '../../i18n/define';
import fieldStrings from '../../i18n/components/sc-field';
import { AlertCircle } from '../../icons/index'; // explicit /index: Stencil only scans file imports for <svg>

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/** A field's strings: the shared "Error:" and "(optional)", plus the component's own. */
export function withField<E extends Record<string, string>>(part?: StringPart<E>): StringPart<E & typeof fieldStrings.en> {
  return {
    en: { ...fieldStrings.en, ...(part?.en ?? {}) },
    ar: { ...fieldStrings.ar, ...(part?.ar ?? {}) },
  } as unknown as StringPart<E & typeof fieldStrings.en>;
}

let counter = 0;

/** A document-unique id for one instance: `sc-text-input-3`. */
export function nextId(tag: string): string {
  counter += 1;
  return `${tag}-${counter}`;
}

/** Joins IDs for aria-describedby; undefined when there are none. */
export function describedBy(...ids: (string | false | undefined | null)[]): string | undefined {
  const list = ids.filter(Boolean) as string[];
  return list.length ? list.join(' ') : undefined;
}

/** A clamped heading level, or undefined. Accepts "1" from an attribute. */
export function headingLevel(level: unknown): HeadingLevel | undefined {
  const n = Number(level);
  return Number.isInteger(n) && n >= 1 && n <= 6 ? (n as HeadingLevel) : undefined;
}

export type SlotName = 'label' | 'hint' | 'error' | 'prefix' | 'suffix';
export type Slotted = Partial<Record<SlotName, Element>>;

/**
 * Takes the host's direct children marked `slot="label|hint|error|…"` out of the host, before
 * the first render, and returns them by name; `Moved` puts each where it belongs. Children
 * already moved (the component was re-attached) are kept from `previous`.
 */
export function takeSlotted(host: HTMLElement, names: readonly SlotName[], previous: Slotted = {}): Slotted {
  const found: Slotted = { ...previous };
  for (const child of Array.from(host.children)) {
    const name = child.getAttribute('slot') as SlotName | null;
    if (name && names.includes(name)) {
      found[name] = child;
      child.remove();
    }
  }
  return found;
}

/** An empty container the vdom never touches, into which a slotted node is moved once. */
export const Moved: FunctionalComponent<{ node?: Element }> = ({ node }) => (
  <span
    class="sc-field__rich"
    ref={(el) => {
      if (el && node && node.parentNode !== el) el.append(node);
    }}
  />
);

interface LabelProps {
  id: string;
  /** The control the `<label>` is for (omit for a legend). */
  htmlFor?: string;
  text?: string;
  rich?: Element;
  optional?: boolean;
  optionalText: string;
  /** When set, the label is also the page heading at this level. */
  level?: HeadingLevel;
  as: 'label' | 'legend';
}

/**
 * The visible label. As the page heading it follows the GOV.UK pattern:
 * `<h1><label>…</label></h1>` for one control and `<legend><h1>…</h1></legend>` for a group.
 */
export const FieldLabel: FunctionalComponent<LabelProps> = ({ id, htmlFor, text, rich, optional, optionalText, level, as }) => {
  const content = [rich ? <Moved node={rich} /> : text, optional && <span class="sc-field__optional"> {optionalText}</span>];
  const cls = { 'sc-field__label': true, 'sc-field__label--heading': !!level };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Heading: any = level ? `h${level}` : null;
  if (as === 'legend') {
    return (
      <legend id={id} class={cls}>
        {Heading ? <Heading class="sc-field__heading">{content}</Heading> : content}
      </legend>
    );
  }
  const label = (
    <label id={id} class={cls} htmlFor={htmlFor}>
      {content}
    </label>
  );
  return Heading ? <Heading class="sc-field__heading">{label}</Heading> : label;
};

/** The hint, below the label. Hidden (and left out of aria-describedby) when empty. */
export const FieldHint: FunctionalComponent<{ id: string; text?: string; rich?: Element; show: boolean }> = ({ id, text, rich, show }) => (
  <div id={id} class="sc-field__hint" hidden={!show}>
    {rich ? <Moved node={rich} /> : text}
  </div>
);

/**
 * The error message: icon, visually hidden "Error:" / "خطأ:" and the message. The icon is
 * decorative; the words carry the meaning. It appears instantly, never animated.
 */
export const FieldError: FunctionalComponent<{ id: string; text?: string; rich?: Element; show: boolean; prefix: string }> = ({ id, text, rich, show, prefix }) => (
  <p id={id} class="sc-field__error" hidden={!show}>
    <AlertCircle class="sc-field__error-icon" />
    <span class="sc-field__error-text">
      <span class="visually-hidden">{prefix} </span>
      {rich ? <Moved node={rich} /> : text}
    </span>
  </p>
);

/** The `expand_more` chevron of a select (E2). Points down in both directions; never mirrors. */
export const ExpandMore: FunctionalComponent<{ class?: string }> = ({ class: extra }) => (
  <svg class={{ icon: true, [extra ?? '']: !!extra }} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <path d="M6.5 9.25L12 14.75l5.5-5.5" />
  </svg>
);

/** A check mark: a symbol, not an arrow, so it never mirrors. */
export const CheckMark: FunctionalComponent<{ class?: string }> = ({ class: extra }) => (
  <svg class={{ icon: true, [extra ?? '']: !!extra }} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <path class="sc-check__path" d="M5 12.5l4.5 4.5L19 7.5" pathLength="1" />
  </svg>
);

/**
 * Runs `cb` after a form that holds `host` is reset (the reset event fires before the browser
 * restores the controls, so the callback waits a microtask). Returns the remover.
 */
export function onFormReset(host: HTMLElement, cb: () => void): () => void {
  if (typeof document === 'undefined' || !document.addEventListener) return () => undefined;
  const listener = (ev: Event) => {
    const form = ev.target as HTMLFormElement;
    const control = host.querySelector('input, select, textarea') as HTMLInputElement | null;
    if ((control && form === control.form) || form?.contains?.(host)) queueMicrotask(cb);
  };
  document.addEventListener('reset', listener, true);
  return () => document.removeEventListener('reset', listener, true);
}

/**
 * Light DOM has no delegatesFocus: send `focus()` on the host to the control, so an
 * error-summary link to the host's id, and scripts that focus the host, reach it.
 */
export function forwardFocus(host: HTMLElement, target: () => HTMLElement | undefined | null): void {
  host.focus = (options?: FocusOptions) => target()?.focus(options);
}

/**
 * Moves direct children of `host` that match `accept` into `target()` when they are added
 * after the first render (a scoped component relocates its default slot only then).
 */
export function adoptChildren(host: HTMLElement, target: () => Element | undefined, accept: (el: Element) => boolean, after?: () => void): MutationObserver | undefined {
  if (typeof MutationObserver === 'undefined') return undefined;
  const observer = new MutationObserver((records) => {
    let moved = false;
    for (const r of records) {
      for (const node of Array.from(r.addedNodes)) {
        const into = target();
        if (into && node.parentNode === host && node instanceof Element && accept(node)) {
          into.append(node);
          moved = true;
        }
      }
    }
    if (moved) after?.();
  });
  observer.observe(host, { childList: true });
  return observer;
}
