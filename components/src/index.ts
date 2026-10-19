/**
 * @sc/components: Shared Channels web components.
 *
 * Plain HTML: load dist/sc-components/sc-components.css and dist/sc-components/sc-components.esm.js (type="module"); tags define themselves.
 * Bundlers: import '@sc/components/dist/components/sc-button.js' (auto-defines), and load dist/sc-components/sc-components.css once.
 */
export type * from './components.d.ts';
export type { ButtonVariant, ButtonSize, ButtonType, ButtonIconPosition } from './components/sc-button/sc-button';
export type { Lang, Dir, StringKey, Channel } from './i18n/strings';
export type { IconName } from './icons/index';
