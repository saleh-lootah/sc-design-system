import { Component, Element, Host, Prop, State, h } from '@stencil/core';
import { LocaleController } from '../../i18n/controller';
import strings from '../../i18n/components/sc-step-progress';
import { Check } from '../../icons/index'; // explicit /index: see CONTRIBUTING

export type StepProgressLayout = 'auto' | 'compact' | 'full';
type StepState = 'done' | 'current' | 'upcoming';

const LAYOUTS: readonly StepProgressLayout[] = ['auto', 'compact', 'full'];

/**
 * The stepper: where the user is in a short linear journey (NAV-02, CMP-09). Direction E's
 * signature component, replacing v1's segmented track.
 *
 * Completed and current markers take the channel action colour (decision U2); completed
 * markers carry a check, the current one an inner dot and a halo, upcoming ones a 2px
 * `outline` edge. Green is never used: it is reserved for genuine success messages.
 *
 * Two layouts:
 * - **compact** (phones; E2–E4): a meta row ("Plate number" … "Step 2 of 4") that carries
 *   the meaning, over a decorative (`aria-hidden`) row of 24px markers.
 * - **full** (E0): an `<ol>` with one column per step: a 28px marker, a connector to the next
 *   step (solid behind, dashed ahead), a state line ("Step 1 · Done") and the step name. The
 *   current step has `aria-current="step"`, and every step says its state in words.
 *
 * `layout="auto"` (the default) shows the full stepper when step names are given and the
 * component is at least 600px wide (a container query), and the compact one otherwise.
 *
 * Step names come from the `steps` property or from the host's child elements, one per step
 * (`<span>Vehicle</span><span>Plate number</span>…`): they are read as text and are not
 * rendered themselves. `current` is 1-based and clamped (DDS F-036). Steps run from the
 * right in Arabic; digits stay Latin.
 *
 * @part meta - The compact row with the step name and "Step 2 of 4".
 * @part label - The current step's name in the compact row.
 * @part count - The "Step 2 of 4" text.
 * @part track - The compact marker row (decorative).
 * @part list - The full layout's `<ol>`.
 */
@Component({
  tag: 'sc-step-progress',
  styleUrl: 'sc-step-progress.css',
  shadow: true,
})
export class ScStepProgress {
  @Element() el!: HTMLElement;

  /** The current step, from 1. Clamped to 1…total. */
  @Prop({ reflect: true }) current = 1;

  /** How many steps there are. Count only the question pages. Ignored when step names are given. */
  @Prop({ reflect: true }) total = 1;

  /** The current step's name in the compact row, e.g. "Plate number". Defaults to the current step's name. */
  @Prop() label?: string;

  /** Overrides "Step {current} of {total}". Use the `{current}` and `{total}` placeholders. */
  @Prop() countText?: string;

  /** The step names, in order, set as a property from JavaScript. Used instead of child elements. */
  @Prop() steps?: string[];

  /** `auto` (default): full from 600px wide when step names are given, else compact. `compact` or `full` force one. */
  @Prop({ reflect: true }) layout: StepProgressLayout = 'auto';

  /** Step names read from child elements. */
  @State() childNames: string[] = [];

  private locale = new LocaleController(this, strings);
  private observer?: MutationObserver;

  connectedCallback() {
    this.locale.connect();
    this.readChildren();
    if (typeof MutationObserver !== 'undefined') {
      this.observer = new MutationObserver(() => this.readChildren());
      this.observer.observe(this.el, { childList: true, subtree: true, characterData: true });
    }
  }

  disconnectedCallback() {
    this.locale.disconnect();
    this.observer?.disconnect();
  }

  private readChildren() {
    this.childNames = Array.from(this.el.children)
      .map((child) => (child.textContent ?? '').trim())
      .filter(Boolean);
  }

  private get names(): string[] {
    const fromProp = Array.isArray(this.steps) ? this.steps.filter((s) => typeof s === 'string' && s.trim()) : [];
    return fromProp.length ? fromProp : this.childNames;
  }

  render() {
    const { t } = this.locale;
    const names = this.names;
    const total = names.length || Math.max(1, Math.floor(Number(this.total) || 1));
    const current = Math.min(total, Math.max(1, Math.floor(Number(this.current) || 1)));
    const values = { current, total };
    const count = this.countText
      ? this.countText.replace(/\{(current|total)\}/g, (_m, k: 'current' | 'total') => String(values[k]))
      : t('stepProgressCount', values);
    const label = this.label || names[current - 1];
    const layout = LAYOUTS.includes(this.layout) ? this.layout : 'auto';
    const showFull = names.length > 0 && layout !== 'compact';
    const showCompact = layout !== 'full' || names.length === 0;
    const stateOf = (n: number): StepState => (n < current ? 'done' : n === current ? 'current' : 'upcoming');
    const steps = Array.from({ length: total }, (_, i) => ({ n: i + 1, state: stateOf(i + 1) }));
    const marker = (state: StepState) => (
      <span class={`marker marker--${state}`}>
        {state === 'done' && <Check />}
      </span>
    );

    return (
      <Host class={{ [`layout-${layout}`]: true, 'has-full': showFull, 'has-compact': showCompact }}>
        {showCompact && (
          <div class="compact">
            <div class="meta" part="meta">
              {label && (
                <span class="label" part="label">
                  {label}
                </span>
              )}
              <span class="count" part="count">
                {count}
              </span>
            </div>
            <div class="track" part="track" aria-hidden="true">
              {steps.map(({ n, state }) => [marker(state), n < total && <span class={`connector connector--${state}`}></span>])}
            </div>
          </div>
        )}
        {showFull && (
          <ol class="full" part="list" aria-label={t('stepProgressLabel')}>
            {steps.map(({ n, state }) => (
              <li class={`step step--${state}`} aria-current={state === 'current' ? 'step' : undefined}>
                <span class="rail" aria-hidden="true">
                  {marker(state)}
                  {n < total && <span class={`connector connector--${state}`}></span>}
                </span>
                <span class="state">
                  {t('stepProgressStep', { n })}
                  {state === 'done' && ` · ${t('stepProgressDone')}`}
                  {state === 'current' && ` · ${t('stepProgressCurrent')}`}
                  {state === 'upcoming' && <span class="visually-hidden"> · {t('stepProgressUpcoming')}</span>}
                </span>
                <span class="name">{names[n - 1]}</span>
              </li>
            ))}
          </ol>
        )}
      </Host>
    );
  }
}
