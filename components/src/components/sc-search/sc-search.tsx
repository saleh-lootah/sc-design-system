import { Component, Element, Event, EventEmitter, Host, Method, Prop, Watch, h } from '@stencil/core';
import { normaliseDigits } from '../../i18n/digits';
import { LocaleController } from '../../i18n/locale';
import { Search } from '../../icons/index'; // explicit /index: Stencil only scans file imports for <svg>

export interface ScSearchDetail {
  /** The query as typed, trimmed. */
  value: string;
}

/**
 * A pill search box: search icon, a labelled field and a primary "Search" button, inside a
 * `<form role="search">` (a search landmark named by the label).
 *
 * Submitting (the button, or Enter in the field) emits `scSearch`. With `action`, the form
 * then goes to that URL with the query as `?<name>=…`, unless a listener calls
 * `preventDefault()`; without `action`, the page handles `scSearch` itself.
 *
 * The form is self-contained: don't nest `sc-search` inside another `<form>`.
 *
 * @part field - The pill around the icon, input and button.
 * @part input - The native `<input type="search">`.
 * @part label - The `<label>`.
 */
@Component({
  tag: 'sc-search',
  styleUrl: 'sc-search.css',
  shadow: { delegatesFocus: true },
})
export class ScSearch {
  @Element() el!: HTMLElement;

  /** The field's label. Defaults to "Search" ("بحث"). Make it specific: "Search Dubai Now services". */
  @Prop() label?: string;

  /**
   * Hides the label visually; screen readers still read it. Only do this when the context
   * makes the purpose obvious, such as a hero whose heading asks "What do you need to do?".
   */
  @Prop({ reflect: true }) labelHidden = false;

  /** Example queries, e.g. `Try "renew car registration"`. A hint, never a replacement for the label. */
  @Prop() placeholder?: string;

  /** The button text. Defaults to "Search" ("بحث"). */
  @Prop() buttonText?: string;

  /** The query parameter name sent with `action`. */
  @Prop() name = 'q';

  /** The query. Updated as the user types. */
  @Prop({ mutable: true }) value = '';

  /** The results page. When set, the form submits there with GET after `scSearch`, unless the event is cancelled. */
  @Prop() action?: string;

  /** Emitted on submit with the trimmed query. Cancelable: `preventDefault()` stops navigation to `action`. */
  @Event({ eventName: 'scSearch', bubbles: true, composed: true, cancelable: true }) scSearch!: EventEmitter<ScSearchDetail>;

  private locale = new LocaleController(this);
  private input?: HTMLInputElement;

  connectedCallback() {
    this.locale.connect();
  }

  disconnectedCallback() {
    this.locale.disconnect();
  }

  @Watch('value')
  onValueChange(next: string) {
    if (this.input && this.input.value !== (next ?? '')) this.input.value = next ?? '';
  }

  /** Focuses the input. */
  @Method()
  async setFocus() {
    this.input?.focus();
  }

  private onInput = (ev: Event) => {
    this.value = normaliseDigits(ev.target as HTMLInputElement);
  };

  private onSubmit = (ev: Event) => {
    const event = this.scSearch.emit({ value: (this.input?.value ?? this.value ?? '').trim() });
    if (event.defaultPrevented || !this.action) ev.preventDefault();
  };

  render() {
    const { t } = this.locale;
    const label = this.label || t('searchLabel');
    return (
      <Host>
        <form class="form" role="search" aria-labelledby="label" action={this.action} method="get" onSubmit={this.onSubmit}>
          <label id="label" class={{ 'label': true, 'type-label-m': true, 'visually-hidden': this.labelHidden }} htmlFor="input" part="label">
            {label}
          </label>
          <div class="field" part="field">
            <Search class="search-icon" />
            <input
              id="input"
              ref={(el) => (this.input = el)}
              class="input type-body-m"
              part="input"
              type="search"
              name={this.name}
              value={this.value}
              placeholder={this.placeholder}
              enterKeyHint="search"
              autoComplete="off"
              spellcheck={false}
              onInput={this.onInput}
            />
            <sc-button class="submit" type="submit">
              {this.buttonText || t('searchButton')}
            </sc-button>
          </div>
        </form>
      </Host>
    );
  }
}
