/**
 * The one SVG wrapper every icon module uses (foundations §10, decision D13).
 *
 * Icons are Material Symbols, weight 400, grade 0, optical size 24, as inline SVG: one path on
 * Material's 960 grid (`viewBox="0 -960 960 960"`), `fill="currentColor"`, so an icon takes the
 * colour of its text. Outlined by default; Filled (FILL 1) only for status icons and the
 * selected state of navigation icons (ICN-02). Paths come from github.com/google/material-design-icons
 * (`symbols/web/<name>/materialsymbolsoutlined/<name>[_fill1]_24px.svg`), Apache 2.0.
 *
 * Always decorative (`aria-hidden`): the words next to an icon carry the meaning. Sized by the
 * `.icon` helper (`--icon-size`, default 20px). Directional icons (`mirror`) get
 * `icon-directional`, which flips them under `:dir(rtl)`.
 *
 * Icons are grouped in small family modules (./arrows, ./status, ./common, ./chrome-icons,
 * ./destinations; ./spinner alone), so a component's closure holds only the families it uses
 * instead of the whole set. One module per icon would cost more: each becomes its own chunk with
 * its own file overhead. The barrels (./index, ./nav, ./chrome) re-export the families under
 * their existing names.
 */
import { FunctionalComponent, h } from '@stencil/core';

export interface IconProps {
  /** Extra classes for the <svg>. */
  class?: string;
}

/** Makes an icon component from a Material Symbols path. */
export const svg =
  (d: string, mirror?: boolean): FunctionalComponent<IconProps> =>
  ({ class: extra }) => (
    <svg
      class={{ 'icon': true, 'icon-directional': !!mirror, [extra ?? '']: !!extra }}
      viewBox="0 -960 960 960"
      width="24"
      height="24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d={d} />
    </svg>
  );
