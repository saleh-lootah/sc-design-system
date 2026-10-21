import { Component, Element, Host, Listen, Prop, State, h } from '@stencil/core';
import { LocaleController } from '../../i18n/controller';
import strings from '../../i18n/components/sc-button';
import { Icon, IconName, Spinner } from '../../icons/index'; // explicit /index: Stencil only scans file imports for <svg> (see CONTRIBUTING)

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'handoff';
export type ButtonSize = 'l' | 'm' | 'xl';
export type ButtonType = 'button' | 'submit' | 'reset';
export type ButtonIconPosition = 'start' | 'end';

const VARIANTS: readonly ButtonVariant[] = ['primary', 'secondary', 'tertiary', 'destructive', 'handoff'];
const SIZES: readonly ButtonSize[] = ['l', 'm', 'xl'];

/**
 * Starts an action. Use a verb: "Continue", "Pay with Dubai Pay", "Save and finish later".
 *
 * v2 renders a native `<button>` (or an `<a>` when `href` is set) in light DOM (Stencil
 * `scoped`, decision A2). The button is a real form control: Enter in a field submits the
 * form through the first `type="submit"` button (it is the form's default button), and
 * `name`, `value`, `form` and a disabled `<fieldset>` all work natively. `focus()` and
 * `click()` on the host reach the inner control. There is no `::part()`: if you must style
 * it, use the classes `.sc-button`, `.sc-button__label` and `.sc-button__icon`.
 *
 * @slot - The label. Text only; keep it short and start with a verb.
 * @slot icon - Optional custom icon (an inline `<svg slot="icon">`), used instead of the
 *   `icon` prop, e.g. provider artwork on a hand-off. Add `data-directional` to an arrow or
 *   chevron so it mirrors in right-to-left.
 */
@Component({
  tag: 'sc-button',
  styleUrl: 'sc-button.css',
  scoped: true,
})
export class ScButton {
  @Element() el!: HTMLElement;

  /**
   * Visual weight.
   * - `primary`: the one main action on a page (channel action fill). 56px.
   * - `secondary`: other actions beside a primary one (outlined in the channel colour). 48px.
   * - `tertiary`: low-emphasis actions, styled as an underlined link. 48px.
   * - `destructive`: deletes or cancels something that can't be undone (error fill). 56px.
   * - `handoff`: a shared government hand-off, such as "Sign in with UAE PASS" or "Pay with
   *   Dubai Pay": city indigo on every channel (decision U3). 56px.
   */
  @Prop({ reflect: true }) variant: ButtonVariant = 'primary';

  /**
   * Height. Leave it unset for the variant's own height (56px for primary, destructive and
   * handoff; 48px for secondary and tertiary). `l` is 56px, `m` 48px (compact layouts,
   * tables, headers), `xl` 64px (the hero search only).
   */
  @Prop({ reflect: true }) size?: ButtonSize;

  /**
   * What the button does in a form. `submit` submits the surrounding `<form>` natively, so
   * validation and `submit` listeners run, and the first submit button is the form's
   * default button for Enter in a field. `reset` resets it. Defaults to `button`, unlike the
   * native element, so a button never submits by accident. Ignored when `href` is set.
   */
  @Prop() type: ButtonType = 'button';

  /** Submitted with the form as `name=value` when this button submits it. */
  @Prop() name?: string;

  /** The value submitted with `name`. */
  @Prop() value?: string;

  /** The id of the `<form>` this button belongs to when it sits outside it (the native `form` attribute). */
  @Prop({ attribute: 'form' }) formId?: string;

  /** Renders a link (`<a href>`) styled as a button. Use it when the action goes to another page. */
  @Prop({ reflect: true }) href?: string;

  /**
   * Prevents interaction. Avoid it (A11Y-08): a disabled button gives no reason and can't be
   * focused. Leave the button enabled and explain the problem with an error message instead.
   */
  @Prop({ reflect: true }) disabled = false;

  /**
   * Shows a spinner while an action is in progress. The button keeps its width and focus,
   * sets `aria-busy`, announces "Loading" and ignores activation (no click handlers, no
   * submit) until `loading` is removed.
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

  /** True when a child carries `slot="icon"`. */
  @State() hasIconSlot = false;

  private locale = new LocaleController(this, strings);
  private control?: HTMLButtonElement | HTMLAnchorElement;
  private labelEl?: HTMLElement;

  connectedCallback() {
    this.locale.connect();
    this.hasIconSlot = Array.from(this.el.children).some((child) => child.getAttribute('slot') === 'icon');
    // Light DOM has no delegatesFocus: send focus() on the host to the native control, so
    // error-summary links and scripts that focus the host keep working.
    this.el.focus = (options?: FocusOptions) => this.control?.focus(options);
  }

  disconnectedCallback() {
    this.locale.disconnect();
  }

  /** Activation is ignored while loading or disabled: no click handlers, no form submission. */
  private onControlClick = (ev: MouseEvent) => {
    if (this.loading || this.disabled) {
      ev.preventDefault();
      ev.stopImmediatePropagation();
    }
  };

  /** `host.click()` (or a click on the host outside the control) activates the native control. */
  @Listen('click')
  onHostClick(ev: MouseEvent) {
    if (ev.target === this.el && this.control) {
      ev.stopImmediatePropagation();
      this.control.click();
    }
  }

  private renderIcon() {
    if (!this.icon && !this.hasIconSlot) return null;
    return <span class="sc-button__icon">{this.hasIconSlot ? <slot name="icon" /> : <Icon name={this.icon} />}</span>;
  }

  render() {
    const variant = VARIANTS.includes(this.variant) ? this.variant : 'primary';
    const quiet = variant === 'secondary' || variant === 'tertiary';
    const size: ButtonSize = this.size && SIZES.includes(this.size) ? this.size : quiet ? 'm' : 'l';
    const loadingText = this.loadingText || this.locale.t('buttonLoading');
    // Before the first render the label is still the host's own text.
    const label = ((this.labelEl ?? this.el).textContent ?? '').trim();

    const classes = {
      'sc-button': true,
      'focus-ring': true,
      [`sc-button--${variant}`]: true,
      [`sc-button--${size}`]: true,
      'is-loading': this.loading,
    };

    const content = [
      this.iconPosition === 'start' && this.renderIcon(),
      <span class="sc-button__label" ref={(el) => (this.labelEl = el)}>
        <slot />
      </span>,
      this.iconPosition !== 'start' && this.renderIcon(),
      this.loading && (
        <span class="sc-button__spinner">
          <Spinner class="spin" />
        </span>
      ),
      this.loading && <span class="visually-hidden">{loadingText}</span>,
    ];

    const control = this.href ? (
      <a
        class={classes}
        ref={(el) => (this.control = el)}
        href={this.disabled ? undefined : this.href}
        role={this.disabled ? 'link' : undefined}
        aria-disabled={this.disabled ? 'true' : undefined}
        aria-busy={this.loading ? 'true' : undefined}
        onClick={this.onControlClick}
      >
        {content}
      </a>
    ) : (
      <button
        class={classes}
        ref={(el) => (this.control = el)}
        type={this.type === 'submit' || this.type === 'reset' ? this.type : 'button'}
        name={this.name}
        value={this.value}
        {...{ form: this.formId }}
        disabled={this.disabled}
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
          {this.loading && label ? this.locale.t('buttonLoadingStatus', { label, loading: loadingText }) : ''}
        </span>
      </Host>
    );
  }
}
