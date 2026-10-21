/**
 * Destination icons for the signed-in navigation (v2, C2): `sc-account-nav` and
 * `sc-bottom-nav` render them by name from an item's `data-icon`. Same grammar as
 * ./index.tsx (24px grid, 2px strokes, `currentColor`, `aria-hidden`); `logout` is
 * DIRECTIONAL and mirrors in right-to-left. A module of its own, so no other component pays
 * for these paths.
 *
 * Names: home, apps, history, description, credit-card, notifications, person, logout.
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

const paths: Record<string, (string | [number, number, number, number])[]> = {
  'home': ['M4 10.5L12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z'],
  'apps': [
    [4, 4, 6, 6],
    [14, 4, 6, 6],
    [4, 14, 6, 6],
    [14, 14, 6, 6],
  ],
  'history': ['M3.5 12a8.5 8.5 0 1 0 2.5-6', 'M3.5 4.5v4h4', 'M12 8v4.5l3 2'],
  'description': ['M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z', 'M14 3v5h5', 'M9 13h6', 'M9 17h6'],
  'credit-card': [[3, 5.5, 18, 13], 'M3 10h18', 'M7 15h4'],
  'notifications': ['M6 17v-6a6 6 0 0 1 12 0v6l1.5 2h-15z', 'M10 21h4'],
  'person': ['M12 4a4 4 0 1 0 0 8a4 4 0 1 0 0-8z', 'M4.5 20a7.5 7.5 0 0 1 15 0'],
  'logout': ['M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4', 'M16 8l4 4-4 4', 'M20 12H10'],
};

/** The icon names navigation items accept (`data-icon`). */
export type NavIconName = keyof typeof paths;

/** Navigation icons that mirror in right-to-left. */
const directional = new Set(['logout']);

/** Renders a navigation icon by name; nothing for an unknown name. */
export const NavIcon: FunctionalComponent<NavIconProps & { name?: string | null }> = ({ name, ...rest }) => {
  const shapes = name ? paths[name] : undefined;
  if (!shapes) return null;
  return (
    <Svg {...rest} directional={directional.has(name!)}>
      {shapes.map((s) => (typeof s === 'string' ? <path d={s} /> : <rect x={s[0]} y={s[1]} width={s[2]} height={s[3]} rx="1.5" />))}
    </Svg>
  );
};
