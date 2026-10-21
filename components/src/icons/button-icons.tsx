/**
 * The icons `sc-button`'s `icon` property can name (Material Symbols, see ./svg.tsx). Self-contained
 * so it is inlined into sc-button's own module rather than shared as extra chunks.
 */
import { FunctionalComponent, h } from '@stencil/core';
import type { IconProps } from './svg';

const set: Record<string, [d: string, mirror: boolean]> = {
  'arrow-forward': ['M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z', true],
  'arrow-back': ['m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z', true],
  'chevron-forward': ['M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z', true],
  'chevron-back': ['M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z', true],
  'external': ['M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z', true],
  'search': ['M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z', false],
  'check': ['M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z', false],
  'close': ['m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z', false],
};

export type ButtonIconName = 'arrow-forward' | 'arrow-back' | 'chevron-forward' | 'chevron-back' | 'external' | 'search' | 'check' | 'close';

/** Renders a button icon by name; nothing for a name outside the set. */
export const ButtonIcon: FunctionalComponent<IconProps & { name?: string }> = ({ name, class: extra }) => {
  const icon = name ? set[name] : undefined;
  return icon ? (
    <svg class={{ 'icon': true, 'icon-directional': icon[1], [extra ?? '']: !!extra }} viewBox="0 -960 960 960" width="24" height="24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d={icon[0]} />
    </svg>
  ) : null;
};
