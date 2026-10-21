/**
 * Directional and disclosure arrows. Every icon here except ExpandMore mirrors in right-to-left.
 * Material Symbols, weight 400, 24px (see ./svg.tsx). One chunk for the family: import what
 * you need by name.
 */
import { svg } from './svg';

/** Forward arrow ("Continue"). `arrow_forward`. */
export const ArrowForward = svg('M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z', true);

/** Back arrow (sc-back-link). `arrow_back`. */
export const ArrowBack = svg('m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z', true);

/** Forward chevron (standalone links, menu rows, pagination, breadcrumbs). `chevron_right`. */
export const ChevronForward = svg('M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z', true);

/** Back chevron (pagination, breadcrumbs). `chevron_left`. */
export const ChevronBack = svg('M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z', true);

/** Opens in a new tab or on another site. `open_in_new`. */
export const External = svg('M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z', true);

/** Expand (chevron down) on disclosure triggers. Never mirrored. `expand_more`. */
export const ExpandMore = svg('M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z');
