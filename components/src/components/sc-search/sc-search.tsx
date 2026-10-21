import { Component, Element, Event, EventEmitter, Host, Method, Prop, Watch, h } from '@stencil/core';
import { normaliseDigits } from '../../i18n/digits';
import { LocaleController } from '../../i18n/controller';
import strings from '../../i18n/components/sc-search';
import { Search } from '../../icons/for/sc-search';

export interface ScSearchDetail {
  /** The query as typed, trimmed. */
  value: string;
}

export type SearchSize = 'm' | 'l';

let counter = 0;

/**
 * A search field and its button, inside a `<form role="search">` named by the label (E1: the
 * field and the primary button are siblings with a 12px gap, not one pill).
 *
 * v2 renders the form, a native `<input type="search">` and an `sc-button type="submit"` in
 * light DOM (Stencil `scoped`, decision A2), so Enter in the field submits through the button
 * natively. Submitting emits `scSearch`. With `action`, the form then goes to that URL with the
 * query as `?<name>=…`, unless a listener calls `preventDefault()`; without `action`, the page
 * handles `scSearch` itself. Don't nest `sc-search` inside another `<form>`.
 */
@Component({
  tag: 'sc-search',
  styleUrl: 'sc-search.css',
  scoped: true,
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

  /** `m` (default): a 56px field and button. `l`: the 64px hero search (E1). */
  @Prop({ reflect: true }) size: SearchSize = 'm';

  /** Emitted on submit with the trimmed query. Cancelable: `preventDefault()` stops navigation to `action`. */
  @Event({ eventName: 'scSearch', bubbles: true, composed: true, cancelable: true }) scSearch!: EventEmitter<ScSearchDetail>;

  private uid = `sc-search-${++counter}`;
  private locale = new LocaleController(this, strings);
  private input?: HTMLInputElement;

  connectedCallback() {
    this.locale.connect();
    // Light DOM has no delegatesFocus: focus() on the host goes to the input.
    this.el.focus = (options?: FocusOptions) => this.input?.focus(options);
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
    const id = this.uid;
    const large = this.size === 'l';
    return (
      <Host>
        <form class="sc-search" role="search" aria-labelledby={`${id}-label`} action={this.action} method="get" onSubmit={this.onSubmit}>
          <label id={`${id}-label`} class={{ 'sc-search__label': true, 'visually-hidden': this.labelHidden }} htmlFor={`${id}-input`}>
            {this.label || t('searchLabel')}
          </label>
          <div class={{ 'sc-search__row': true, 'sc-search--l': large }}>
            <div class="sc-search__field">
              <Search class="sc-search__icon" />
              <input
                id={`${id}-input`}
                ref={(el) => (this.input = el)}
                class="sc-search__input"
                type="search"
                name={this.name}
                value={this.value}
                placeholder={this.placeholder}
                enterKeyHint="search"
                autoComplete="off"
                spellcheck={false}
                onInput={this.onInput}
              />
            </div>
            <sc-button class="sc-search__button" type="submit" size={large ? 'xl' : 'l'}>
              {this.buttonText || t('searchButton')}
            </sc-button>
          </div>
        </form>
      </Host>
    );
  }
}
