import { Component, Element, Host, Prop, h } from '@stencil/core';
import { describedBy, forwardFocus, nextId } from '../sc-text-input/field';

/**
 * One option in an `sc-radio-group`. Its content is the option's label.
 *
 * v2 renders a native `<input type="radio">`, its `<label>` and hint in light DOM (Stencil
 * `scoped`, decision A2). Every radio in a group shares the group's `name` in one document
 * tree, so they form a real native radio group: one Tab stop, arrow keys move and select,
 * "2 of 3" is announced, and the form submits the chosen value. Use it only inside
 * `sc-radio-group`, which passes down the name, the chosen value and the error state.
 *
 * @slot - The option label: "Dubai". Text, or text with `<sc-ltr>` for values.
 */
@Component({
  tag: 'sc-radio',
  styleUrls: ['../sc-text-input/choice.css', 'sc-radio.css'],
  scoped: true,
})
export class ScRadio {
  @Element() el!: HTMLElement;

  /** The value submitted when this option is chosen. */
  @Prop({ reflect: true }) value!: string;

  /** Help text under this option's label. */
  @Prop({ reflect: true }) hint?: string;

  /** Chosen when the page loads (unless the group has a `value`). */
  @Prop({ reflect: true }) checked = false;

  /** Disables this option. Avoid it; remove options that don't apply instead. */
  @Prop({ reflect: true }) disabled = false;

  /** @internal Set by sc-radio-group: the shared `name`. */
  @Prop() groupName?: string;

  /** @internal Set by sc-radio-group: this option is the chosen one. */
  @Prop() selected = false;

  /** @internal Set by sc-radio-group: the group is in its error state. */
  @Prop() groupInvalid = false;

  /** @internal Set by sc-radio-group: a choice is required. */
  @Prop() groupRequired = false;

  private uid = nextId('sc-radio');
  private input?: HTMLInputElement;

  connectedCallback() {
    forwardFocus(this.el, () => this.input);
  }

  componentDidRender() {
    if (this.input && this.input.checked !== this.selected) this.input.checked = this.selected;
  }

  private setInput = (el?: HTMLInputElement) => {
    // The option chosen when the page loaded is what a form reset restores.
    if (el && !this.input) el.defaultChecked = this.selected;
    this.input = el;
  };

  render() {
    const id = this.uid;
    return (
      <Host>
        <div class="sc-choice">
          <span class="sc-choice__halo" aria-hidden="true" />
          <input
            ref={this.setInput}
            id={`${id}-control`}
            class={{ 'sc-choice__box': true, 'sc-choice__box--radio': true, 'sc-choice__box--invalid': this.groupInvalid }}
            type="radio"
            name={this.groupName}
            value={this.value ?? (this.el.textContent ?? '').trim()}
            checked={this.selected}
            disabled={this.disabled}
            required={this.groupRequired}
            aria-describedby={describedBy(!!this.hint && `${id}-hint`)}
          />
          <span class="sc-choice__mark sc-choice__mark--radio" aria-hidden="true" />
          <label class="sc-choice__label" htmlFor={`${id}-control`}>
            <slot />
          </label>
          {this.hint && (
            <div id={`${id}-hint`} class="sc-choice__hint">
              {this.hint}
            </div>
          )}
        </div>
      </Host>
    );
  }
}
