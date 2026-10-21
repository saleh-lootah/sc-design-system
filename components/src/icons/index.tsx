/**
 * Inline SVG icons as Stencil functional components.
 *
 * - Drawn on a 24px grid, 2px strokes, `currentColor`, so they take the text colour.
 * - Always decorative (`aria-hidden`): the words next to an icon carry the meaning.
 * - Size with the `.icon` class from the shared helper sheet (src/global/shadow.css) (`--icon-size`, default 20px).
 * - DIRECTIONAL icons (marked below) get the `icon-directional` class and are mirrored in
 *   right-to-left by `.icon-directional:dir(rtl)` in the shared helper sheet. Icons for time,
 *   media, real objects and logos are never mirrored.
 *
 *   import { ArrowForward, Icon } from '../../icons/index'; // always '/index', never the folder:
 *   // Stencil only enables SVG rendering when it can follow the import to a file that contains <svg>.
 *   <ArrowForward />            // by component
 *   <Icon name="arrow-forward" /> // by name, e.g. from an `icon` prop
 */
import { FunctionalComponent, h } from '@stencil/core';

export interface IconProps {
  /** Extra classes for the <svg>. */
  class?: string;
}

interface SvgProps extends IconProps {
  directional?: boolean;
}

const Svg: FunctionalComponent<SvgProps> = ({ directional, class: extra }, children) => (
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

/** DIRECTIONAL. Forward arrow ("Continue"). */
export const ArrowForward: FunctionalComponent<IconProps> = (p) => (
  <Svg {...p} directional>
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </Svg>
);

/** DIRECTIONAL. Forward chevron (standalone links, service cards). */
export const ChevronForward: FunctionalComponent<IconProps> = (p) => (
  <Svg {...p} directional>
    <path d="M9 5.5l6.5 6.5L9 18.5" />
  </Svg>
);

/** DIRECTIONAL. Back chevron (BackLink). */
export const ChevronBack: FunctionalComponent<IconProps> = (p) => (
  <Svg {...p} directional>
    <path d="M15 5.5L8.5 12l6.5 6.5" />
  </Svg>
);

/** DIRECTIONAL. Opens in a new tab: the arrow points to the end corner. */
export const External: FunctionalComponent<IconProps> = (p) => (
  <Svg {...p} directional>
    <path d="M14 4h6v6" />
    <path d="M20 4l-9 9" />
    <path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />
  </Svg>
);

/** Error status. */
export const AlertCircle: FunctionalComponent<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5.5" />
    <circle cx="12" cy="16.5" r="1.25" fill="currentColor" stroke="none" />
  </Svg>
);

/** Success status. */
export const CheckCircle: FunctionalComponent<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12.5l2.75 2.75L16 10" />
  </Svg>
);

/** Information. */
export const Info: FunctionalComponent<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5.5" />
    <circle cx="12" cy="7.75" r="1.25" fill="currentColor" stroke="none" />
  </Svg>
);

/** Warning status. */
export const Warning: FunctionalComponent<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M10.27 4.03L2.82 17.03A2 2 0 0 0 4.55 20h14.9a2 2 0 0 0 1.73-2.97L13.73 4.03a2 2 0 0 0-3.46 0z" />
    <path d="M12 9.5v4" />
    <circle cx="12" cy="16.75" r="1.25" fill="currentColor" stroke="none" />
  </Svg>
);

/** Progress spinner: a faint track and a quarter arc. Add the `spin` class to rotate it. */
export const Spinner: FunctionalComponent<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" stroke-opacity="0.25" />
    <path d="M21 12a9 9 0 0 0-9-9" />
  </Svg>
);

/** Search (magnifier). Not mirrored. */
export const Search: FunctionalComponent<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-4-4" />
  </Svg>
);

/** Close / dismiss. */
export const Close: FunctionalComponent<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M6 6l12 12" />
    <path d="M18 6L6 18" />
  </Svg>
);

/** Every icon by name, for components that take an `icon` prop. */
export const icons = {
  'arrow-forward': ArrowForward,
  'chevron-forward': ChevronForward,
  'chevron-back': ChevronBack,
  'external': External,
  'alert-circle': AlertCircle,
  'check-circle': CheckCircle,
  'info': Info,
  'warning': Warning,
  'spinner': Spinner,
  'search': Search,
  'close': Close,
} as const;

export type IconName = keyof typeof icons;

/** Icons that mirror in right-to-left. */
export const directionalIcons: ReadonlySet<IconName> = new Set<IconName>([
  'arrow-forward',
  'chevron-forward',
  'chevron-back',
  'external',
]);

export function isIconName(name: unknown): name is IconName {
  return typeof name === 'string' && name in icons;
}

/** Renders an icon by name; renders nothing for an unknown name. */
export const Icon: FunctionalComponent<IconProps & { name?: string }> = ({ name, ...rest }) => {
  if (!isIconName(name)) return null;
  const Component = icons[name];
  return <Component {...rest} />;
};
