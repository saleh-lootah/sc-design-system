/**
 * Shared building blocks for the form-field family (sc-text-input, sc-textarea, sc-select,
 * sc-radio-group, sc-checkbox, sc-checkbox-group, sc-date-input). Not a component: plain
 * functional components and helpers imported by each field, with the styles in field.css.
 *
 * Every field renders its label, hint, error and control in ONE shadow root, because ARIA
 * ID references (for, aria-describedby, aria-labelledby) can't cross a shadow boundary.
 * IDs only need to be unique inside that shadow root, so they are fixed strings.
 */
import { FunctionalComponent, h } from '@stencil/core';
import { AlertCircle } from '../../icons/index'; // explicit /index: Stencil only scans file imports for <svg>

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/** IDs used inside every field's shadow root. */
export const IDS = {
  control: 'control',
  label: 'label',
  hint: 'hint',
  error: 'error',
} as const;

/** True when the host has a light-DOM child in the named slot. */
export function hasSlotted(el: HTMLElement, name: string): boolean {
  return Array.from(el.children).some((child) => child.getAttribute('slot') === name);
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

interface LabelProps {
  /** Label text (the `label` prop); the `label` slot overrides it. */
  text?: string;
  /** Appends the "(optional)" string. */
  optional?: boolean;
  optionalText: string;
  /** When set, the label is also the page heading at this level. */
  level?: HeadingLevel;
  /** `label` (for a single control) or `legend` (for a fieldset). */
  as: 'label' | 'legend';
  htmlFor?: string;
}

/**
 * The visible label. As a page heading it follows the GOV.UK pattern:
 * `<h1><label>…</label></h1>` for a single control and `<legend><h1>…</h1></legend>` for a group.
 */
export const FieldLabel: FunctionalComponent<LabelProps> = ({ text, optional, optionalText, level, as, htmlFor }) => {
  const content = [
    <slot name="label">{text}</slot>,
    optional && <span class="optional"> {optionalText}</span>,
  ];
  const cls = { 'label': true, 'label--heading': !!level };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Heading: any = level ? `h${level}` : null;

  if (as === 'legend') {
    return (
      <legend id={IDS.label} class={cls} part="label">
        {Heading ? <Heading class="heading">{content}</Heading> : content}
      </legend>
    );
  }
  const label = (
    <label id={IDS.label} class={cls} htmlFor={htmlFor} part="label">
      {content}
    </label>
  );
  return Heading ? <Heading class="heading">{label}</Heading> : label;
};

/** The hint, below the label. Hidden (and left out of aria-describedby) when empty. */
export const FieldHint: FunctionalComponent<{ text?: string; show: boolean }> = ({ text, show }) => (
  <div id={IDS.hint} class="hint" part="hint" hidden={!show}>
    <slot name="hint">{text}</slot>
  </div>
);

/**
 * The error message: icon, visually hidden "Error:" prefix (from strings) and the message.
 * Hidden when there's no error. The icon is decorative; the words carry the meaning.
 */
export const FieldError: FunctionalComponent<{ text?: string; show: boolean; prefix: string }> = ({ text, show, prefix }) => (
  <p id={IDS.error} class="error" part="error" hidden={!show}>
    <AlertCircle class="error-icon" />
    <span class="error-text">
      <span class="visually-hidden">{prefix} </span>
      <slot name="error">{text}</slot>
    </span>
  </p>
);

/**
 * True where form-associated custom elements work (every supported browser). False in the
 * spec-test DOM, whose ElementInternals is a stub, so components skip form syncing there.
 */
export function formSupported(): boolean {
  return typeof ElementInternals !== 'undefined' && 'setFormValue' in ElementInternals.prototype;
}

/** Validity flags that ElementInternals.setValidity accepts, copied from a native control. */
const FLAGS: (keyof ValidityStateFlags)[] = [
  'valueMissing',
  'typeMismatch',
  'patternMismatch',
  'tooLong',
  'tooShort',
  'rangeUnderflow',
  'rangeOverflow',
  'stepMismatch',
  'badInput',
  'customError',
];

/**
 * Mirrors a native control's validity onto the host, anchored to that control so the
 * browser's validation bubble and `form.reportValidity()` focus it.
 */
export function mirrorValidity(internals: ElementInternals | undefined, control: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | undefined) {
  if (!internals?.setValidity || !control?.validity) return;
  if (control.validity.valid) {
    internals.setValidity({});
    return;
  }
  const flags: ValidityStateFlags = {};
  for (const flag of FLAGS) if (control.validity[flag]) flags[flag] = true;
  internals.setValidity(flags, control.validationMessage || ' ', control);
}

/** Re-dispatches a native `change` from the host: native `change` events are not composed. */
export function emitNativeChange(host: HTMLElement) {
  host.dispatchEvent(new Event('change', { bubbles: true }));
}
