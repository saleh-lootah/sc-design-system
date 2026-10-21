/**
 * The shared icon set: Material Symbols as inline SVG (foundations §10, D13). See ./svg.tsx for
 * the rules. Icons live in small family modules (./arrows, ./status, ./common,
 * ./chrome-icons, ./destinations, ./spinner); this file re-exports them, so a named import from here
 * pulls in only the families of the icons named:
 *
 *   import { ArrowForward } from '../../icons/index';  // always '/index' or the icon's own file
 *
 * Components that take an icon by name use a small named set (./button-icons, ./empty-state-icons)
 * so they pay only for the names they accept. DIRECTIONAL (mirrors in right-to-left): ArrowForward,
 * ArrowBack, ChevronForward, ChevronBack, External, Logout.
 */
export type { IconProps } from './svg';
export { ArrowForward, ArrowBack, ChevronForward, ChevronBack, External, ExpandMore } from './arrows';
export { AlertCircle, CheckCircle, Info, Warning, Schedule, Pending, Hourglass } from './status';
export { Search, Close, Check, Menu, Inbox, Language } from './common';
export { Spinner } from './spinner';

/** Every icon name an `icon` property can name, across components (each accepts a subset). */
export type IconName =
  | 'arrow-forward'
  | 'arrow-back'
  | 'chevron-forward'
  | 'chevron-back'
  | 'external'
  | 'alert-circle'
  | 'check-circle'
  | 'info'
  | 'warning'
  | 'schedule'
  | 'pending'
  | 'hourglass'
  | 'search'
  | 'close'
  | 'check'
  | 'inbox';
