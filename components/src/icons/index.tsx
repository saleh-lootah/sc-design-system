/**
 * Icons: Material Symbols as inline SVG (foundations §10, decision D13).
 *
 * - The paths live in ./icons.json: Outlined, weight 400, grade 0, optical size 24, on Material's
 *   960 grid, from github.com/google/material-design-icons (Apache 2.0). Filled (FILL 1) only for
 *   status icons and the current navigation item (ICN-02). `mirror: true` icons flip in
 *   right-to-left (the foundations mirroring table).
 * - A component imports its icons by name from its own generated module:
 *
 *     import { ArrowForward, Close } from '../../icons/for/sc-modal';
 *
 *   `npm run icons` (scripts/gen-icons.mjs) writes src/icons/for/<key>.tsx with exactly those
 *   icons, so the bundler inlines them into the component and no shared icon chunk grows as
 *   families add icons (W9). `npm run check:icons` fails when a generated file is stale.
 * - To add an icon: put its Material path in icons.json (name, material, fill, mirror, note, d),
 *   import it from icons/for/<your-tag>, run `npm run icons`.
 */

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
  | 'search'
  | 'check'
  | 'close'
  | 'add'
  | 'download'
  | 'inbox';
