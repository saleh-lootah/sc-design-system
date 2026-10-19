/**
 * The calendar icon for sc-date-range, drawn like the shared set in src/icons (24px grid,
 * 2px strokes, currentColor, decorative). It is a real object, so it never mirrors. Kept
 * here rather than in the shared file, which only its owners edit; move it to src/icons
 * when another component needs it.
 */
import { FunctionalComponent, h } from '@stencil/core';

export const CalendarIcon: FunctionalComponent<{ class?: string }> = ({ class: extra }) => (
  <svg
    class={{ icon: true, [extra ?? '']: !!extra }}
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
    <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
    <path d="M3.5 10h17" />
    <path d="M8 3v4" />
    <path d="M16 3v4" />
  </svg>
);
