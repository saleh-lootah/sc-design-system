import { Component, Element, Event, EventEmitter, Host, Listen, Prop, State, h } from '@stencil/core';
import { LocaleController } from '../../i18n/controller';
import groupStrings from '../../i18n/components/sc-checkbox-group';
import { FieldError, FieldHint, FieldLabel, HeadingLevel, Slotted, adoptChildren, describedBy, forwardFocus, headingLevel, nextId, onFormReset, takeSlotted, withField } from '../sc-text-input/field';

type CheckboxEl = HTMLElement & { checked: boolean; value: string; groupName?: string; groupInvalid: boolean };
const strings = withField(groupStrings);

/**
 * Several choices from a short list: "Which documents do you have?".
 *
 * v2 renders a native `<fieldset>` with its `<legend>`, hint and error in light DOM (Stencil
 * `scoped`, decision A2), and moves the `sc-checkbox` children into it, so they are grouped
 * and named by the legend natively. Each checked box submits its own value under the group's
 * `name`. `disabled` disables the fieldset (and so every box). With `required`, the first box
 * carries a native validity error until one is checked.
 *
 * @slot - `sc-checkbox` elements, one per option.
 */
@Component({
  tag: 'sc-checkbox-group',
  styleUrls: ['../sc-text-input/field.css', 'sc-checkbox-group.css'],
  scoped: true,
})
export class ScCheckboxGroup {
  @Element() el!: HTMLElement;

  /** The question, shown as the legend: "Which documents do you have?". */
  @Prop() label?: string;

  /** Help text below the legend: "Select all that apply". */
  @Prop() hint?: string;

  /** The error message. Setting it shows the error state on the group and every box. */
  @Prop({ reflect: true }) error?: string;

  /** Appends "(optional)" to the legend. */
  @Prop() optional = false;

  /** The name each checked box submits its value under (unless the box has its own `name`). */
  @Prop({ reflect: true }) name?: string;

  /** Requires at least one box to be checked. Not shown visually. */
  @Prop() required = false;

  /** Disables every checkbox (through the fieldset). Avoid it. */
  @Prop({ reflect: true }) disabled = false;

  /** Lays short options side by side. They wrap on narrow screens. */
  @Prop({ reflect: true }) inline = false;

  /** When set (1–6), the legend is also the page heading at this level. */
  @Prop() headingLevel?: HeadingLevel;

  /** Fires when any box is toggled, with the values of all checked boxes: `{ value: string[] }`. */
  @Event({ bubbles: true, composed: true }) scGroupChange!: EventEmitter<{ value: string[] }>;

  @State() slotted: Slotted = {};

  private uid = nextId('sc-checkbox-group');
  private options?: HTMLElement;
  private observer?: MutationObserver;
  private locale = new LocaleController(this, strings);
  private stopReset?: () => void;

  connectedCallback() {
    this.locale.connect();
    this.slotted = takeSlotted(this.el, ['label', 'hint', 'error'], this.slotted);
    forwardFocus(this.el, () => this.boxes.find((b) => !b.querySelector('input')?.disabled)?.querySelector('input'));
    this.stopReset = onFormReset(this.el, () => queueMicrotask(() => this.sync()));
    this.observer = adoptChildren(this.el, () => this.options, (el) => el.localName === 'sc-checkbox', () => this.sync());
  }

  disconnectedCallback() {
    this.locale.disconnect();
    this.stopReset?.();
    this.observer?.disconnect();
  }

  componentDidRender() {
    this.sync();
  }

  private get boxes(): CheckboxEl[] {
    return Array.from(this.el.querySelectorAll('sc-checkbox')).filter((b) => b.parentElement?.closest('sc-checkbox-group') === this.el) as CheckboxEl[];
  }

  /** Passes the name and error state to each box, and sets the "at least one" validity. */
  private sync() {
    const invalid = !!this.error || !!this.slotted.error;
    const boxes = this.boxes;
    for (const box of boxes) {
      if (box.groupName !== this.name) box.groupName = this.name;
      if (box.groupInvalid !== invalid) box.groupInvalid = invalid;
    }
    const inputs = boxes.map((b) => b.querySelector('input')).filter(Boolean) as HTMLInputElement[];
    const missing = this.required && !inputs.some((i) => i.checked);
    const anchor = inputs.find((i) => !i.disabled);
    for (const input of inputs) input.setCustomValidity?.(missing && input === anchor ? this.locale.t('checkboxGroupRequired') : '');
  }

  @Listen('change')
  onBoxChange(ev: Event) {
    const box = (ev.target as HTMLElement).closest?.('sc-checkbox');
    if (!box || box.parentElement?.closest('sc-checkbox-group') !== this.el) return;
    this.sync();
    this.scGroupChange.emit({ value: this.boxes.filter((b) => b.querySelector('input')?.checked).map((b) => b.value) });
  }

  render() {
    const { t } = this.locale;
    const id = this.uid;
    const { slotted } = this;
    const hasHint = !!this.hint || !!slotted.hint;
    const hasError = !!this.error || !!slotted.error;

    return (
      <Host>
        <fieldset class={{ 'sc-field': true, 'sc-field--error': hasError }} disabled={this.disabled} aria-describedby={describedBy(hasHint && `${id}-hint`, hasError && `${id}-error`)}>
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
