import { Component, Element, Event, EventEmitter, Host, Listen, Prop, State, Watch, h } from '@stencil/core';
import { LocaleController } from '../../i18n/controller';
import { FieldError, FieldHint, FieldLabel, HeadingLevel, Slotted, adoptChildren, describedBy, forwardFocus, headingLevel, nextId, onFormReset, takeSlotted, withField } from '../sc-text-input/field';

type RadioEl = HTMLElement & { value: string; checked: boolean; groupName?: string; selected: boolean; groupInvalid: boolean; groupRequired: boolean };
const strings = withField();

/**
 * One choice from a short list: "Who issued the plate?".
 *
 * v2 renders a native `<fieldset>` (role `radiogroup`) with its `<legend>`, hint and error in
 * light DOM (Stencil `scoped`, decision A2), and moves the `sc-radio` children into it. Each
 * `sc-radio` renders a native radio with the group's `name`, so they form a real native radio
 * group: one Tab stop, arrow keys move and select, position in set, native submission,
 * reset and `required`. `disabled` disables the fieldset. `focus()` on the host reaches the
 * chosen radio, or the first.
 *
 * Without a `name`, the radios share a generated one (`sc-radio-group-3`), which a form
 * would submit: give the group a `name` inside a form.
 *
 * @slot - `sc-radio` elements, one per option.
 */
@Component({
  tag: 'sc-radio-group',
  styleUrls: ['../sc-text-input/field.css', 'sc-radio-group.css'],
  scoped: true,
})
export class ScRadioGroup {
  @Element() el!: HTMLElement;

  /** The question, shown as the legend: "Who issued the plate?". */
  @Prop() label?: string;

  /** Help text below the legend. */
  @Prop() hint?: string;

  /** The error message. Setting it shows the error state: "Select who issued the plate". */
  @Prop({ reflect: true }) error?: string;

  /** Appends "(optional)" to the legend. */
  @Prop() optional = false;

  /** The name submitted with the form. */
  @Prop({ reflect: true }) name?: string;

  /** The chosen value. Defaults to the `sc-radio` with `checked`. */
  @Prop({ mutable: true }) value?: string;

  /** Requires a choice (native `valueMissing` until one is made). Not shown visually. */
  @Prop() required = false;

  /** Disables every option (through the fieldset). Avoid it. */
  @Prop({ reflect: true }) disabled = false;

  /** Lays two short options side by side ("Yes" / "No"). They wrap on narrow screens. */
  @Prop({ reflect: true }) inline = false;

  /** When set (1–6), the legend is also the page heading at this level (`<legend><h1>…</h1></legend>`). */
  @Prop() headingLevel?: HeadingLevel;

  /** Fires when the choice changes with `{ value }`. The native `change` event also bubbles from the radio. */
  @Event({ bubbles: true, composed: true }) scChange!: EventEmitter<{ value: string }>;

  @State() slotted: Slotted = {};

  private uid = nextId('sc-radio-group');
  private initialValue?: string;
  private options?: HTMLElement;
  private observer?: MutationObserver;
  private locale = new LocaleController(this, strings);
  private stopReset?: () => void;

  connectedCallback() {
    this.locale.connect();
    this.slotted = takeSlotted(this.el, ['label', 'hint', 'error'], this.slotted);
    forwardFocus(this.el, () => {
      const inputs = this.radios.map((r) => r.querySelector('input')).filter((i) => i && !i.disabled) as HTMLInputElement[];
      return inputs.find((i) => i.checked) ?? inputs[0];
    });
    this.stopReset = onFormReset(this.el, () => {
      // Back to the choice the page loaded with (radios rendered before the group pushed
      // their state, so their own defaultChecked can't be trusted).
      this.value = this.initialValue;
      for (const input of this.radios.map((r) => r.querySelector('input'))) if (input) input.checked = input.value === this.value;
    });
    this.observer = adoptChildren(this.el, () => this.options, (el) => el.localName === 'sc-radio', () => this.sync());
  }

  disconnectedCallback() {
    this.locale.disconnect();
    this.stopReset?.();
    this.observer?.disconnect();
  }

  componentWillLoad() {
    if (this.value == null) this.value = this.radios.find((r) => r.hasAttribute('checked'))?.getAttribute('value') ?? undefined;
    this.initialValue = this.value;
  }

  componentDidRender() {
    this.sync();
  }

  @Watch('value')
  onValueChange() {
    this.sync();
  }

  private get radios(): RadioEl[] {
    return Array.from(this.el.querySelectorAll('sc-radio')).filter((r) => r.parentElement?.closest('sc-radio-group') === this.el) as unknown as RadioEl[];
  }

  /** Passes the shared name, the choice, the error and `required` down to each radio. */
  private sync() {
    const invalid = !!this.error || !!this.slotted.error;
    const name = this.name || this.uid;
    for (const r of this.radios) {
      const value = r.getAttribute('value') ?? (r.textContent ?? '').trim();
      const next = { groupName: name, selected: value === this.value, groupInvalid: invalid, groupRequired: this.required };
      for (const [k, v] of Object.entries(next)) if ((r as unknown as Record<string, unknown>)[k] !== v) (r as unknown as Record<string, unknown>)[k] = v;
    }
  }

  @Listen('change')
  onRadioChange(ev: Event) {
    const input = ev.target as HTMLInputElement;
    if (input.type !== 'radio' || !input.checked || input.closest('sc-radio-group') !== this.el) return;
    this.value = input.value;
    this.scChange.emit({ value: this.value });
  }

  render() {
    const { t } = this.locale;
    const id = this.uid;
    const { slotted } = this;
    const hasHint = !!this.hint || !!slotted.hint;
    const hasError = !!this.error || !!slotted.error;

    return (
      <Host>
        <fieldset
          class={{ 'sc-field': true, 'sc-field--error': hasError }}
          role="radiogroup"
          aria-labelledby={`${id}-label`}
          aria-describedby={describedBy(hasHint && `${id}-hint`, hasError && `${id}-error`)}
          aria-invalid={hasError ? 'true' : undefined}
          aria-required={this.required ? 'true' : undefined}
          disabled={this.disabled}
        >
          <FieldLabel id={`${id}-label`} text={this.label} rich={slotted.label} optional={this.optional} optionalText={t('fieldOptional')} level={headingLevel(this.headingLevel)} as="legend" />
          <FieldHint id={`${id}-hint`} text={this.hint} rich={slotted.hint} show={hasHint} />
          <FieldError id={`${id}-error`} text={this.error} rich={slotted.error} show={hasError} prefix={t('fieldErrorPrefix')} />
          <div ref={(el) => (this.options = el)} class={{ 'sc-choice-group__options': true, 'sc-choice-group__options--inline': this.inline }}>
            <slot />
          </div>
        </fieldset>
      </Host>
    );
  }
}
