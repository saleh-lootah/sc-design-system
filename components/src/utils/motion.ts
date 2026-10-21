/**
 * Enter and exit motion for chrome popovers, menus and sheets (MOT-01 to MOT-15).
 *
 * - Only a pointer activation animates. Keyboard activation is instant (MOT-02): callers
 *   pass `pointer` from the event (`MouseEvent.detail > 0` for a click).
 * - Durations and scales come from the tokens on the element, so the reduced-motion
 *   overrides (`--sc-scale-enter: 1`) apply; movement is also dropped under reduced motion,
 *   while opacity keeps its timing.
 * - Web Animations, so an exit can interrupt an entrance cleanly.
 */

/** A duration token (`120ms`, `0.2s`) in milliseconds. */
function duration(el: Element, name: string, fallback: number): number {
  const raw = getComputedStyle(el).getPropertyValue(name).trim();
  const n = parseFloat(raw);
  if (Number.isNaN(n)) return fallback;
  return /ms$/.test(raw) ? n : /s$/.test(raw) ? n * 1000 : n;
}

function prop(el: Element, name: string, fallback: string): string {
  return getComputedStyle(el).getPropertyValue(name).trim() || fallback;
}

function reduced(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function canAnimate(el: Element): boolean {
  return typeof (el as HTMLElement).animate === 'function';
}

export type Entrance = 'scale' | 'rise';

/**
 * Plays an entrance: `scale` grows from `--sc-scale-enter` (popovers and menus, from the
 * transform origin set in CSS), `rise` moves up 8px (the mobile menu). Opacity always fades in.
 */
export function enter(el: HTMLElement | undefined, pointer: boolean, kind: Entrance = 'scale'): void {
  if (!el || !pointer || !canAnimate(el)) return;
  const still = reduced();
  const from: Keyframe = { opacity: 0 };
  if (!still) from.transform = kind === 'scale' ? `scale(${prop(el, '--sc-scale-enter', '0.96')})` : 'translateY(8px)';
  const to: Keyframe = { opacity: 1 };
  if (!still) to.transform = 'none';
  el.animate([from, to], {
    duration: duration(el, '--sc-duration-base', 200),
    easing: prop(el, '--sc-easing-enter', 'ease-out'),
  });
}

/** Fades out (pointer only), then calls `done`. From the keyboard `done` runs at once. */
export function exit(el: HTMLElement | undefined, pointer: boolean, done: () => void): void {
  if (!el || !pointer || !canAnimate(el)) {
    done();
    return;
  }
  const animation = el.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: duration(el, '--sc-duration-exit', 160),
    easing: prop(el, '--sc-easing-exit', 'ease-out'),
    fill: 'forwards',
  });
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    done();
    animation.cancel();
  };
  animation.onfinish = finish;
  animation.oncancel = finish;
}

/** True when a click came from a pointer (mouse, touch, pen); false for Enter or Space. */
export function fromPointer(ev?: Event): boolean {
  return !!ev && (ev as MouseEvent).detail > 0;
}
