/**
 * Navigation icons (v2, C2): the back arrow (sc-back-link) and the language globe
 * (sc-language-switch). The destination icons of the signed-in navigation are in
 * ./destinations.tsx.
 *
 * Kept in their own module rather than in ./index.tsx so they never enter the shared icon
 * chunk that every component with an `icon` prop (sc-button) pays for. Same grammar as
 * ./index.tsx: 24px grid, 2px strokes, `currentColor`, always `aria-hidden`, sized by the
 * `.icon` helper; DIRECTIONAL icons get `icon-directional` and mirror in right-to-left.
 *
 *   import { ArrowBack } from '../../icons/nav'; // a file import, so Stencil sees <svg>
 */
import { FunctionalComponent, h } from '@stencil/core';

export interface NavIconProps {
  /** Extra classes for the <svg>. */
  class?: string;
}

const Svg: FunctionalComponent<NavIconProps & { directional?: boolean }> = ({ directional, class: extra }, children) => (
  <svg
    class={{ 'icon': true, 'icon-directional': !!directional, [extra ?? '']: !!extra }}
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    {children}
  </svg>
);

/** DIRECTIONAL. Back arrow (sc-back-link). */
export const ArrowBack: FunctionalComponent<NavIconProps> = (p) => (
  <Svg {...p} directional>
    <path d="M19 12H5" />
    <path d="M11 6l-6 6 6 6" />
  </Svg>
);

/** Language (a globe). Never mirrored. */
export const Language: FunctionalComponent<NavIconProps> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18z" />
  </Svg>
);
