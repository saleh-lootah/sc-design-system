import { AttachInternals, Component, Element, Event, EventEmitter, Host, Prop, State, Watch, forceUpdate, h } from '@stencil/core';
import { LocaleController } from '../../i18n/locale';
import { ChevronForward } from '../../icons/index'; // explicit /index: enables SVG rendering for this component (see CONTRIBUTING)
import { FieldError, FieldHint, FieldLabel, HeadingLevel, IDS, describedBy, emitNativeChange, hasSlotted, headingLevel, mirrorValidity, formSupported } from '../sc-text-input/field-v1';

interface OptionData {
  value: string;
  text: string;
  disabled: boolean;
  selected: boolean;
}

interface GroupData {
  label: string;
  disabled: boolean;
  options: OptionData[];
}

function readOption(o: Element): OptionData {
  const text = (o.textContent ?? '').replace(/\s+/g, ' ').trim();
  return {
    value: o.hasAttribute('value') ? o.getAttribute('value')! : text,
    text: o.getAttribute('label') ?? text,
    disabled: o.hasAttribute('disabled'),
    selected: o.hasAttribute('selected'),
  };
}

/**
 * One choice from a list too long for radios, such as the emirate that issued a plate.
 *
 * A native `<select>` inside the shadow root, styled like `sc-text-input`, with a chevron.
 * Write the options as light-DOM `<option>` (and `<optgroup>`) children: they are copied
 * into the inner select and kept in sync when they change. Form-associated and delegates focus.
 *
 * @slot label - Rich label content, instead of the `label` prop.
 * @slot hint - Rich hint content, instead of the `hint` prop.
 * @slot error - Rich error content, instead of the `error` prop.
 *
 * @part field - The field group (gets the error bar).
 * @part label - The `<label>`.
 * @part hint - The hint.
 * @part error - The error message.
 * @part frame - The bordered box around the select.
 * @part control - The native `<select>`.
 */
@Component({
  tag: 'sc-select',
  styleUrl: 'sc-select.css',
  shadow: { delegatesFocus: true },
  formAssociated: true,
})
export class ScSelect {
  @Element() el!: HTMLElement;

  @AttachInternals() internals!: ElementInternals;

  /** The visible label: "Issuing emirate". */
  @Prop() label?: string;

  /** Help text below the label. */
  @Prop() hint?: string;

  /** The error message. Setting it shows the error state. */
  @Prop({ reflect: true }) error?: string;

  /** Appends "(optional)" to the label. */
  @Prop() optional = false;

  /** The name submitted with the form. */
  @Prop({ reflect: true }) name?: string;

  /** The selected value. Defaults to the `<option selected>`, else the first option. */
  @Prop({ mutable: true }) value?: string;

  /** Requires a choice. Make the first option a placeholder with `value=""` ("Select an emirate"). */
  @Prop() required = false;

  /** Disables the field. Avoid it. */
  @Prop({ reflect: true }) disabled = false;

  /** Autofill hint, for example `country-name`. */
  @Prop() autocomplete?: string;

  /** When set (1–6), the label is also the page heading at this level. */
  @Prop() headingLevel?: HeadingLevel;

  /** Fires when the selection changes with `{ value }`. A native `change` (and `input`) also reach the host. */
  @Event({ bubbles: true, composed: true }) scChange!: EventEmitter<{ value: string }>;

  @State() formDisabled = false;
  @State() slots = { label: false, hint: false, error: false };

  private select?: HTMLSelectElement;
  private defaultValue = '';
  private observer?: MutationObserver;
  private locale = new LocaleController(this);

  connectedCallback() {
    this.locale.connect();
    this.readSlots();
    if (typeof MutationObserver !== 'undefined') {
      this.observer = new MutationObserver(() => {
        this.readSlots();
        forceUpdate(this);
      });
      this.observer.observe(this.el, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['value', 'label', 'disabled', 'selected'] });
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
    if (this.value == null) {
      const options = this.options();
      this.value = (options.find((o) => o.selected) ?? options[0])?.value ?? '';
    }
    this.defaultValue = this.value;
  }

  componentDidRender() {
    // Set after the options exist, so the inner select always shows `value`.
    if (this.select && this.select.value !== this.value) this.select.value = this.value ?? '';
    if (!formSupported()) return;
    this.internals?.setFormValue?.(this.value ?? '');
    mirrorValidity(this.internals, this.select);
  }

  @Watch('value')
  onValueChange() {
    if (this.select && this.select.value !== (this.value ?? '')) this.select.value = this.value ?? '';
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

  /** Light-DOM options in order, flattened. */
  private options(): OptionData[] {
    return this.groups().flatMap((g) => g.options);
  }

  /** Light-DOM `<option>` and `<optgroup>` children. Loose options get a group with no label. */
  private groups(): GroupData[] {
    const groups: GroupData[] = [];
    for (const child of Array.from(this.el.children)) {
      const tag = child.localName;
      if (tag === 'option') {
        const last = groups[groups.length - 1];
        if (last && !last.label) last.options.push(readOption(child));
        else groups.push({ label: '', disabled: false, options: [readOption(child)] });
      } else if (tag === 'optgroup') {
        groups.push({
          label: child.getAttribute('label') ?? '',
          disabled: child.hasAttribute('disabled'),
          options: Array.from(child.children).filter((o) => o.localName === 'option').map(readOption),
        });
      }
    }
    return groups;
  }

  private readSlots = () => {
    const next = { label: hasSlotted(this.el, 'label'), hint: hasSlotted(this.el, 'hint'), error: hasSlotted(this.el, 'error') };
    if (JSON.stringify(next) !== JSON.stringify(this.slots)) this.slots = next;
  };

  private onChange = (ev: Event) => {
    this.value = (ev.target as HTMLSelectElement).value;
    this.scChange.emit({ value: this.value });
    emitNativeChange(this.el);
  };

  private renderOption = (o: OptionData) => (
    <option value={o.value} disabled={o.disabled} selected={o.value === this.value}>
      {o.text}
    </option>
  );

  render() {
    const { t } = this.locale;
    const hasHint = !!this.hint || this.slots.hint;
    const hasError = !!this.error || this.slots.error;
    const disabled = this.disabled || this.formDisabled;

    return (
      <Host>
        <div class={{ 'field': true, 'field--error': hasError }} part="field">
          <FieldLabel text={this.label} optional={this.optional} optionalText={t('optional')} level={headingLevel(this.headingLevel)} as="label" htmlFor={IDS.control} />
          <FieldHint text={this.hint} show={hasHint} />
          <FieldError text={this.error} show={hasError} prefix={t('errorPrefix')} />
          <div class={{ 'frame': true, 'frame--select': true, 'frame--error': hasError, 'frame--disabled': disabled }} part="frame">
            <select
              ref={(el) => (this.select = el)}
              id={IDS.control}
              class="control"
              part="control"
              required={this.required}
              disabled={disabled}
              autoComplete={this.autocomplete}
              aria-describedby={describedBy(hasHint && IDS.hint, hasError && IDS.error)}
              aria-invalid={hasError ? 'true' : undefined}
              onChange={this.onChange}
            >
              {this.groups().map((g) =>
                g.label ? (
                  <optgroup label={g.label} disabled={g.disabled}>
                    {g.options.map(this.renderOption)}
                  </optgroup>
                ) : (
                  g.options.map(this.renderOption)
                ),
              )}
            </select>
            <span class="chevron" aria-hidden="true">
              <ChevronForward />
            </span>
          </div>
        </div>
      </Host>
    );
  }
}
