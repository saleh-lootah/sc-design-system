import { Component, Host, h } from '@stencil/core';

/**
 * Keeps a value left-to-right inside any text, e.g. a plate number, amount, reference or
 * phone number in an Arabic sentence. Renders `<bdi dir="ltr">` around its content.
 *
 * Shadow DOM is used on purpose: the author's text stays in the light DOM (searchable,
 * copyable, untouched), and layout follows the flat tree, so the `<bdi>` isolates the
 * slotted text from the surrounding paragraph exactly as a `<bdi>` written in place would.
 * The host is also `unicode-bidi: isolate; direction: ltr` (here and in sc.css), so the
 * value is isolated even before the component upgrades.
 *
 * @slot - The value to keep left-to-right.
 */
@Component({
  tag: 'sc-ltr',
  styleUrl: 'sc-ltr.css',
  shadow: true,
})
export class ScLtr {
  render() {
    return (
      <Host>
        <bdi dir="ltr">
          <slot />
        </bdi>
      </Host>
    );
  }
}
