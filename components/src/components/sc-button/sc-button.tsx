import { AttachInternals, Component, Element, Host, Listen, Prop, State, forceUpdate, h } from '@stencil/core';
import { LocaleController } from '../../i18n/locale';
import { Icon, IconName, Spinner } from '../../icons/index'; // explicit /index: Stencil only scans file imports for <svg> (see CONTRIBUTING)

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'destructive';
export type ButtonSize = 'l' | 'm';
export type ButtonType = 'button' | 'submit' | 'reset';
export type ButtonIconPosition = 'start' | 'end';

const VARIANTS: readonly ButtonVariant[] = ['primary', 'secondary', 'tertiary', 'destructive'];

/**
 * Starts an action. Use a verb: "Continue", "Pay with Dubai Pay", "Save and finish later".
 *
 * Renders a native `<button>` (or an `<a>` when `href` is set) inside its shadow root.
 * The host is form-associated, so `type="submit"` and `type="reset"` work with the
 * surrounding `<form>`, and it delegates focus to the inner control.
 *
 * @slot - The button label. Text only; keep it short and start with a verb.
 * @slot icon - Optional custom icon (an inline `<svg>`), used instead of the `icon` prop.
 *   Add `data-directional` to an arrow or chevron so it mirrors in right-to-left.
 *
 * @part control - The inner `<button>` or `<a>`.
 * @part label - The wrapper around the default slot.
 * @part icon - The wrapper around the icon.
 */
@Component({
  tag: 'sc-button',
  styleUrl: 'sc-button.css',
  shadow: { delegatesFocus: true },
  formAssociated: true,
})
export class ScButton {
  @Element() el!: HTMLElement;

  @AttachInternals() internals!: ElementInternals;

  /**
   * Visual weight.
   * - `primary`: the one main action on a page (channel action fill).
   * - `secondary`: other actions next to a primary one (channel subtle fill).
   * - `tertiary`: low-emphasis actions (no fill, underline on hover).
   * - `destructive`: deletes or cancels something that can't be undone (error fill).
   */
  @Prop({ reflect: true }) variant: ButtonVariant = 'primary';

  /** Height: `l` is 54px (default, for primary actions), `m` is 44px (dense layouts). */
  @Prop({ reflect: true }) size: ButtonSize = 'l';

  /**
   * What the button does in a form. `submit` submits the surrounding `<form>` (through
   * `form.requestSubmit()`, so validation and `submit` listeners run); `reset` resets it.
   * Defaults to `button`, unlike the native element, so a button never submits by accident.
   * Ignored when `href` is set.
   */
  @Prop() type: ButtonType = 'button';

  /** Renders a link (`<a href>`) styled as a button. Use it when the action goes to another page. */
  @Prop({ reflect: true }) href?: string;

  /**
   * Prevents interaction. Avoid it: a disabled button gives no reason and can't be
   * focused, so many users can't tell why they're stuck. Leave the button enabled and
   * explain the problem with an error message instead.
   */
  @Prop({ reflect: true }) disabled = false;

  /**
   * Shows a spinner while an action is in progress. The button keeps its width, sets
   * `aria-busy`, announces "Loading" and ignores clicks until `loading` is removed.
   */
  @Prop({ reflect: true }) loading = false;

  /** Overrides the visually hidden "Loading" text (default from strings, in the page language). */
  @Prop() loadingText?: string;

  /** Stretches the button to the width of its container. Use it on narrow screens. */
  @Prop({ reflect: true }) fullWidth = false;

  /** An icon from the library (`src/icons`), e.g. `arrow-forward`. Arrows and chevrons mirror in right-to-left. */
  @Prop() icon?: IconName;

  /** Where the icon sits relative to the label. */
  @Prop() iconPosition: ButtonIconPosition = 'end';

  /** True while an ancestor `<fieldset disabled>` disables the button. */
  @State() formDisabled = false;

  /** True when content is slotted into `icon`. */
  @State() hasIconSlot = false;

  private locale = new LocaleController(this);

  connectedCallback() {
    this.locale.connect();
    this.hasIconSlot = Array.from(this.el.children).some((child) => child.getAttribute('slot') === 'icon');
  }

  disconnectedCallback() {
    this.locale.disconnect();
  }

  /** Form-associated lifecycle: called when a `<fieldset disabled>` ancestor changes. */
  formDisabledCallback(disabled: boolean) {
    this.formDisabled = disabled;
  }

  private get isDisabled(): boolean {
    return this.disabled || this.formDisabled;
  }

  /** Clicks inside the shadow root: stop them at the source while disabled or loading. */
  private onControlClick = (ev: MouseEvent) => {
    if (this.loading || this.isDisabled) {
      ev.preventDefault();
      ev.stopPropagation();
    }
  };

  /** Every click on the host (from the inner control, or `el.click()`) runs the form action. */
  @Listen('click')
  onHostClick(ev: MouseEvent) {
    if (this.loading || this.isDisabled) {
      ev.preventDefault();
      ev.stopImmediatePropagation();
      return;
    }
    if (this.href || ev.defaultPrevented) return;
    const form = this.internals?.form;
    if (!form) return;
    if (this.type === 'submit') {
      if (typeof form.requestSubmit === 'function') form.requestSubmit();
      else form.submit();
    } else if (this.type === 'reset') {
      form.reset();
    }
  }

  private onIconSlotChange = (ev: Event) => {
    this.hasIconSlot = (ev.target as HTMLSlotElement).assignedNodes().length > 0;
  };

  /** The loading announcement quotes the label, so keep it current. */
  private onLabelSlotChange = () => {
    if (this.loading) forceUpdate(this);
  };

  private renderIcon() {
    const hasIcon = !!this.icon || this.hasIconSlot;
    return (
      <span class={{ 'icon-box': true, 'icon-box--empty': !hasIcon }} part="icon">
        <slot name="icon" onSlotchange={this.onIconSlotChange}>
          <Icon name={this.icon} />
        </slot>
      </span>
    );
  }

  render() {
    const { t } = this.locale;
    const variant = VARIANTS.includes(this.variant) ? this.variant : 'primary';
    const size = this.size === 'm' ? 'm' : 'l';
    const disabled = this.isDisabled;
    const label = (this.el.textContent ?? '').trim();
    const loadingText = this.loadingText || t('loading');

    const classes = {
      'control': true,
      'focus-ring': true,
      [`control--${variant}`]: true,
      [`control--${size}`]: true,
      [size === 'l' ? 'type-title-s' : 'type-label-m']: true,
      'is-loading': this.loading,
    };

    const content = [
      this.iconPosition === 'start' && this.renderIcon(),
      <span class="label" part="label">
        <slot onSlotchange={this.onLabelSlotChange} />
      </span>,
      this.iconPosition !== 'start' && this.renderIcon(),
      this.loading && (
        <span class="spinner">
          <Spinner class="spin" />
        </span>
      ),
      this.loading && <span class="visually-hidden">{loadingText}</span>,
    ];

    const control = this.href ? (
      <a
        class={classes}
        part="control"
        href={disabled ? undefined : this.href}
        role={disabled ? 'link' : undefined}
        aria-disabled={disabled ? 'true' : undefined}
        aria-busy={this.loading ? 'true' : undefined}
        onClick={this.onControlClick}
      >
        {content}
      </a>
    ) : (
      <button
        class={classes}
        part="control"
        type="button"
        disabled={disabled}
        aria-busy={this.loading ? 'true' : undefined}
        onClick={this.onControlClick}
      >
        {content}
      </button>
    );

    return (
      <Host>
        {control}
        <span class="visually-hidden" role="status">
          {this.loading ? t('buttonLoadingStatus', { label, loading: loadingText }) : ''}
        </span>
      </Host>
    );
  }
}
