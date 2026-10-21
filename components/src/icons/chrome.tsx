/**
 * Icons used only by the site chrome (header, menus, utility bar). Same rules as ./index.tsx:
 * a 24px grid, 2px strokes in `currentColor`, always `aria-hidden`; DIRECTIONAL icons get
 * `icon-directional` and mirror in right-to-left.
 *
 * Kept out of ./index.tsx so the shared icon set (and every component that imports it by
 * name) does not grow with icons only the chrome uses. Import by component, from this file:
 *
 *   import { Menu, ExpandMore } from '../../icons/chrome';
 */
import { FunctionalComponent, h } from '@stencil/core';

export interface IconProps {
  class?: string;
}

const Svg: FunctionalComponent<IconProps & { directional?: boolean }> = ({ directional, class: extra }, children) => (
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

/** Menu (three lines). Not mirrored. */
export const Menu: FunctionalComponent<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
);

/** Close (×). Not mirrored. */
export const CloseIcon: FunctionalComponent<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
);

/** Expand (chevron down) on disclosure triggers. Not mirrored. */
export const ExpandMore: FunctionalComponent<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M6.5 9.5L12 15l5.5-5.5" />
  </Svg>
);

/** DIRECTIONAL. Forward chevron on menu rows. */
export const Chevron: FunctionalComponent<IconProps> = (p) => (
  <Svg {...p} directional>
    <path d="M9 5.5l6.5 6.5L9 18.5" />
  </Svg>
);

/** Check mark (the current channel). Not mirrored. */
export const Check: FunctionalComponent<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Svg>
);

/** Search (magnifier). Not mirrored. */
export const SearchIcon: FunctionalComponent<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-4-4" />
  </Svg>
);

/** Notifications (bell). Not mirrored. */
export const Bell: FunctionalComponent<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" />
    <path d="M10 20.5a2 2 0 0 0 4 0" />
  </Svg>
);

/** Person (profile). Not mirrored. */
export const Person: FunctionalComponent<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
  </Svg>
);

/** Settings (gear). Not mirrored. */
export const Settings: FunctionalComponent<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" />
  </Svg>
);

/** Representation (two people: acting for someone else). Not mirrored. */
export const Group: FunctionalComponent<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="9" cy="8.5" r="3.5" />
    <path d="M2.5 19.5a6.5 6.5 0 0 1 13 0" />
    <path d="M15.5 5.2a3.5 3.5 0 0 1 0 6.6M18 13.8a6.5 6.5 0 0 1 3.5 5.7" />
  </Svg>
);

/** DIRECTIONAL. Sign out (a door with an arrow leaving it). */
export const Logout: FunctionalComponent<IconProps> = (p) => (
  <Svg {...p} directional>
    <path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" />
    <path d="M15 8l4 4-4 4M19 12H9" />
  </Svg>
);

/** Happiness Meter (a smiling face). Not mirrored. */
export const Mood: FunctionalComponent<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 14a4 4 0 0 0 7 0" />
    <path d="M9 9.5h.01M15 9.5h.01" stroke-width="2.5" />
  </Svg>
);

/** Phone (a real object: not mirrored). */
export const Phone: FunctionalComponent<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M6.6 3.5h-2a1.5 1.5 0 0 0-1.5 1.6A16.5 16.5 0 0 0 18.9 20.9a1.5 1.5 0 0 0 1.6-1.5v-2a1.5 1.5 0 0 0-1.2-1.5l-3-.7a1.5 1.5 0 0 0-1.4.4l-1.3 1.3a12 12 0 0 1-5-5l1.3-1.3a1.5 1.5 0 0 0 .4-1.4l-.7-3a1.5 1.5 0 0 0-1.5-1.2z" />
  </Svg>
);

/** Chat (a speech bubble). Not mirrored. */
export const Chat: FunctionalComponent<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H9l-5 4z" />
  </Svg>
);

/** Accessibility (a figure with open arms). Not mirrored. */
export const AccessibilityIcon: FunctionalComponent<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="4.5" r="1.5" />
    <path d="M5 8l7 1.5L19 8M12 9.5V14M12 14l-3 6M12 14l3 6" />
  </Svg>
);

/** Information. Not mirrored. */
export const InfoIcon: FunctionalComponent<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5.5" />
    <circle cx="12" cy="7.75" r="1.25" fill="currentColor" stroke="none" />
  </Svg>
);

/** Warning. Not mirrored. */
export const WarningIcon: FunctionalComponent<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M10.27 4.03L2.82 17.03A2 2 0 0 0 4.55 20h14.9a2 2 0 0 0 1.73-2.97L13.73 4.03a2 2 0 0 0-3.46 0z" />
    <path d="M12 9.5v4" />
    <circle cx="12" cy="16.75" r="1.25" fill="currentColor" stroke="none" />
  </Svg>
);

/** Error (a circle with an exclamation mark). Not mirrored. */
export const ErrorIcon: FunctionalComponent<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5.5" />
    <circle cx="12" cy="16.5" r="1.25" fill="currentColor" stroke="none" />
  </Svg>
);

/** Fingerprint: a placeholder glyph for the UAE PASS button until the official kit arrives (U3a). Not mirrored. */
export const Fingerprint: FunctionalComponent<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M6.5 7.5a7 7 0 0 1 11 0" />
    <path d="M5 12a7 7 0 0 1 14 0v1.5" />
    <path d="M8.5 19a10 10 0 0 0 .5-4.5V12a3 3 0 0 1 6 0v2" />
    <path d="M12 12v2.5a12 12 0 0 1-1.5 6" />
    <path d="M15.5 17.5a14 14 0 0 1-.8 3" />
  </Svg>
);
