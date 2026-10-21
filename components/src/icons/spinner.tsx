import { FunctionalComponent, h } from '@stencil/core';
import type { IconProps } from './svg';

/**
 * Spinner: a 270° arc, 2.5px stroke, round caps, no track (Paper sc-spinner, node 4RS-0). Not a
 * Material Symbol: Material has no loading glyph. Turned by the `.spin` helper (linear,
 * `--sc-duration-spin`); still under reduced motion. Never mirrored.
 */
export const Spinner: FunctionalComponent<IconProps> = ({ class: extra }) => (
  <svg class={{ icon: true, [extra ?? '']: !!extra }} viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="9" transform="rotate(-90 12 12)" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="42.41 56.55" />
  </svg>
);
