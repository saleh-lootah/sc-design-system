import { AttachInternals, Component, Element, Event, EventEmitter, Host, Prop, State, forceUpdate, h } from '@stencil/core';
import { LocaleController } from '../../i18n/locale';
import { AlertCircle } from '../../icons/index'; // explicit /index: enables SVG rendering for this component (see CONTRIBUTING)
import { FieldError, FieldHint, FieldLabel, HeadingLevel, IDS, describedBy, emitNativeChange, hasSlotted, headingLevel, formSupported } from '../sc-text-input/field';

void AlertCircle;

interface RadioData {
  el: HTMLElement;
  value: string;
  hint: string;
  disabled: boolean;
  checked: boolean;
}

/**
 * One choice from a short list: "Who issued the plate?".
 *
 * A `<fieldset>` with a `<legend>` (exposed as `role="radiogroup"`, labelled by the legend
 * and described by the hint and error), and one native `<input type="radio">` per
 * `sc-radio` child, all inside this element's shadow root. Each `sc-radio` is slotted into
 * its option's `<label>` (manual slot assignment), so its content names the radio while the
 * radios themselves stay in one tree: native arrow keys, one Tab stop, position in set.
 *
 * Form-associated: submits the chosen value under `name`, resets, and reports
 * `valueMissing` when `required`. Delegates focus, so an error-summary link to the host's
 * `id` focuses the first radio.
 *
 * @slot - `sc-radio` elements, one per option.
 * @slot label - Rich legend content, instead of the `label` prop.
 * @slot hint - Rich hint content, instead of the `hint` prop.
 * @slot error - Rich error content, instead of the `error` prop.
 *
 * @part field - The `<fieldset>` (gets the error bar).
 * @part label - The `<legend>`.
 * @part hint - The hint.
 * @part error - The error message.
 * @part options - The wrapper around the options.
 * @part option - One option row.
 * @part radio - A native `<input type="radio">`.
 * @part option-label - An option's `<label>`.
 * @part option-hint - An option's hint.
 */
@Component({
  tag: 'sc-radio-group',
  styleUrl: 'sc-radio-group.css',
  shadow: { delegatesFocus: true, slotAssignment: 'manual' },
  formAssociated: true,
})
export class ScRadioGroup {
  @Element() el!: HTMLElement;

  @AttachInternals() internals!: ElementInternals;

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

  /** Requires a choice (`valueMissing` until one is made). Not shown visually. */
  @Prop() required = false;

  /** Disables every option. Avoid it. */
  @Prop({ reflect: true }) disabled = false;

  /** Lays two short options side by side ("Yes" / "No"). They wrap on narrow screens. */
  @Prop({ reflect: true }) inline = false;

  /**
   * When set (1–6), the legend is also the page heading at this level
   * (`<legend><h1>…</h1></legend>`). Use it when the question is the only one on the page.
   */
  @Prop() headingLevel?: HeadingLevel;

  /** Fires when the choice changes with `{ value }`. A native `change` is also dispatched on the host. */
  @Event({ bubbles: true, composed: true }) scChange!: EventEmitter<{ value: string }>;

  @State() formDisabled = false;
  @State() slots = { label: false, hint: false, error: false };

  private defaultValue?: string;
  private observer?: MutationObserver;
  private locale = new LocaleController(this);

  connectedCallback() {
    this.locale.connect();
    this.readSlots();
    if (typeof MutationObserver !== 'undefined') {
      // Options added, removed, relabelled or changed (sc-radio reflects its props).
      this.observer = new MutationObserver(() => {
        this.readSlots();
        forceUpdate(this);
      });
      this.observer.observe(this.el, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['value', 'hint', 'checked', 'disabled', 'slot'] });
    }
  }

  componentDidLoad() {
    // slotchange bubbles to the shadow root but not past it.
    this.el.shadowRoot?.addEventListener('slotchange', this.readSlots);
  }

  disconnectedCallback() {
    this.locale.disconnect();
    this.observer?.disconnect();
  }

  componentWillLoad() {
    if (this.value == null) this.value = this.radios().find((r) => r.checked)?.value;
    this.defaultValue = this.value;
  }

  componentDidRender() {
    this.assignSlots();
    this.sync();
  }

  formDisabledCallback(disabled: boolean) {
    this.formDisabled = disabled;
  }

  formResetCallback() {
    this.value = this.defaultValue;
  }

  formStateRestoreCallback(state: string | null) {
    if (typeof state === 'string') this.value = state;
  }

  private radios(): RadioData[] {
    return Array.from(this.el.children)
      .filter((c): c is HTMLElement => c.localName === 'sc-radio')
      .map((el) => ({
        el,
        value: el.getAttribute('value') ?? (el.textContent ?? '').trim(),
        hint: el.getAttribute('hint') ?? '',
        disabled: el.hasAttribute('disabled'),
        checked: el.hasAttribute('checked'),
      }));
  }

  private get inputs(): HTMLInputElement[] {
    return Array.from(this.el.shadowRoot?.querySelectorAll<HTMLInputElement>('input[type="radio"]') ?? []);
  }

  /**
   * Manual slot assignment: each sc-radio goes into its own option label, and children with
   * slot="label|hint|error" into those slots. Nothing else in the light DOM is rendered.
   */
  private assignSlots() {
    const root = this.el.shadowRoot;
    if (!root) return;
    const radios = this.radios();
    for (const slot of Array.from(root.querySelectorAll('slot'))) {
      if (typeof slot.assign !== 'function') return; // not supported (spec-test DOM)
      const name = slot.getAttribute('name') ?? '';
      const option = /^option-(\d+)$/.exec(name);
      if (option) {
        const radio = radios[Number(option[1])];
        slot.assign(...(radio ? [radio.el] : []));
      } else {
        slot.assign(...Array.from(this.el.children).filter((c) => c.getAttribute('slot') === name));
      }
    }
  }

  private sync() {
    if (!formSupported()) return;
    const value = this.value ?? '';
    this.internals?.setFormValue?.(value || null);
    if (!this.internals?.setValidity) return;
    const anchor = this.inputs.find((i) => !i.disabled);
    if (this.required && !value && anchor) {
      this.internals.setValidity({ valueMissing: true }, this.locale.t('radioGroupRequired'), anchor);
    } else {
      this.internals.setValidity({});
    }
  }

  private readSlots = () => {
    const next = { label: hasSlotted(this.el, 'label'), hint: hasSlotted(this.el, 'hint'), error: hasSlotted(this.el, 'error') };
    if (JSON.stringify(next) !== JSON.stringify(this.slots)) this.slots = next;
  };

  private onChange = (ev: Event) => {
    const input = ev.target as HTMLInputElement;
    if (!input.checked) return;
    this.value = input.value;
    this.scChange.emit({ value: this.value });
    emitNativeChange(this.el);
  };

  render() {
    const { t } = this.locale;
    const hasHint = !!this.hint || this.slots.hint;
    const hasError = !!this.error || this.slots.error;
    const disabled = this.disabled || this.formDisabled;
    const radios = this.radios();

    return (
      <Host>
        <fieldset
          class={{ 'field': true, 'field--error': hasError }}
          part="field"
          role="radiogroup"
          aria-labelledby={IDS.label}
          aria-describedby={describedBy(hasHint && IDS.hint, hasError && IDS.error)}
          aria-invalid={hasError ? 'true' : undefined}
          aria-required={this.required ? 'true' : undefined}
          disabled={disabled}
         
        >
          <FieldLabel text={this.label} optional={this.optional} optionalText={t('optional')} level={headingLevel(this.headingLevel)} as="legend" />
          <FieldHint text={this.hint} show={hasHint} />
          <FieldError text={this.error} show={hasError} prefix={t('errorPrefix')} />
          <div class={{ 'options': true, 'options--inline': this.inline }} part="options">
            {radios.map((r, i) => {
              const id = `option-${i}`;
              return (
                <div class="option" part="option" key={id}>
                  <input
                    id={id}
                    class={{ 'box': true, 'box--radio': true, 'box--invalid': hasError, 'focus-ring': true }}
                    part="radio"
                    type="radio"
                    name="choice"
                    value={r.value}
                    checked={r.value === this.value}
                    disabled={r.disabled}
                    aria-describedby={r.hint ? `${id}-hint` : undefined}
                    onChange={this.onChange}
                  />
                  <span class="mark mark--radio" aria-hidden="true" />
                  <label class="option-label" htmlFor={id} part="option-label">
                    <slot name={id} />
                  </label>
                  {r.hint && (
                    <div id={`${id}-hint`} class="option-hint" part="option-hint">
                      {r.hint}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </fieldset>
      </Host>
    );
  }
}
