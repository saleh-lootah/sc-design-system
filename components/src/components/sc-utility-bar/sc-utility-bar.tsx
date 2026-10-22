import { Component, Element, Host, Prop, h } from '@stencil/core';
import { LocaleController } from '../../i18n/controller';
import strings from '../../i18n/components/sc-utility-bar';
import { Accessibility as AccessibilityIcon, Chat, GridView, Mood, Phone } from '../../icons/for/sc-utility-bar';


/** The custom property the page reads to keep clear of the docked bar. */
const RESERVE = '--sc-utility-bar-block-size';

/** Where the bar is docked; mirrors the CSS. Below 600px of viewport height it is static (R11). */
const DOCKED = '(min-width: 1024px) and (min-height: 600px)';

/**
 * The help and feedback bar of a channel site (decision U4, Standard CHR-05; component-
 * language B4 as amended by U4): the Happiness Meter, Call 04, Services, Chat and
 * Accessibility, each an icon with a visible label (labels never collapse to icons).
 *
 * From 1024px it is a flat bar docked to the bottom of the viewport across the full width,
 * at `elevation-1`, with a 1px `outline-variant` edge along its top: 48px items with 12px of
 * block padding (Paper board ERV-0). It publishes its height
 * as `--sc-utility-bar-block-size` on `<html>`: `sc-page` pads its end by it and `sc.css`
 * sets `scroll-padding-block-end` from it, so the bar never covers content or the focused
 * element (WCAG 2.4.11). Below 1024px it folds into the footer: place it straight after
 * `sc-footer`, and it becomes an in-flow "Help and feedback" group, a 2 × 2 grid of outlined
 * text buttons (Services is left out there: the site's menu already carries it). It is
 * present when the page loads and does not animate.
 *
 * At short viewport heights (below 600px, which also covers high zoom) the wide bar is not
 * docked: it keeps its row of items but sits static at the end of the page, and publishes no
 * height, so `sc-page` reserves nothing (decision R11; WCAG 2.4.11 and 1.4.10).
 *
 * Without JavaScript (PERF-04): the bar renders in shadow DOM, so write the same links as
 * light-DOM children in `slot="fallback"` (a `<nav aria-label="Help and feedback">` with a
 * `<ul>` of `<a href>`). The browser shows them, in the flow at the end of the page, until the
 * bar upgrades; the upgraded bar has no `fallback` slot, so they are then neither shown nor
 * read.
 *
 * @slot fallback - Never shown once upgraded: the links for pages without JavaScript (PERF-04), shown until the bar upgrades.
 *
 * A `<nav>` labelled "Help and feedback". Items appear when their `*-href` is set.
 *
 * @part bar - The `<nav>`.
 * @part item - Each link.
 */
@Component({
  tag: 'sc-utility-bar',
  styleUrl: 'sc-utility-bar.css',
  shadow: true,
})
export class ScUtilityBar {
  @Element() el!: HTMLElement;

  /** The Happiness Meter survey. */
  @Prop() happinessHref?: string;

  /** The call centre ("Call 04"): usually `tel:04…` or the contact page. */
  @Prop() contactHref?: string;

  /** The number shown after "Call", isolated left to right. */
  @Prop() contactNumber = '04';

  /** The channel's services page. Shown in the docked bar only (from 1024px). */
  @Prop() servicesHref?: string;

  /** The chat service. */
  @Prop() chatHref?: string;

  /** Accessibility options or the accessibility statement. */
  @Prop() accessibilityHref?: string;

  private locale = new LocaleController(this, strings);
  private nav?: HTMLElement;
  private resize?: ResizeObserver;
  private media?: MediaQueryList;

  connectedCallback() {
    this.locale.connect();
    if (typeof matchMedia === 'function') {
      // The bar docks (position: fixed) only in this range; R11 keeps it static below 600px tall.
      this.media = matchMedia(DOCKED);
      this.media.addEventListener('change', this.publish);
    }
  }

  componentDidLoad() {
    if (typeof ResizeObserver !== 'undefined' && this.nav) {
      this.resize = new ResizeObserver(this.publish);
      this.resize.observe(this.nav);
    }
    this.publish();
  }

  disconnectedCallback() {
    this.locale.disconnect();
    this.resize?.disconnect();
    this.media?.removeEventListener('change', this.publish);
    this.el.ownerDocument?.documentElement.style.removeProperty(RESERVE);
  }

  /** Publishes the docked bar's height (0 when it is in the flow). */
  private publish = () => {
    const html = this.el.ownerDocument?.documentElement;
    if (!html || !this.nav) return;
    const docked = getComputedStyle(this.nav).position === 'fixed' && !this.el.hidden;
    if (docked) html.style.setProperty(RESERVE, `${Math.ceil(this.nav.getBoundingClientRect().height)}px`);
    else html.style.removeProperty(RESERVE);
  };

  render() {
    const { t } = this.locale;
    const items: [string | undefined, unknown, unknown, string?][] = [
      [this.happinessHref, <Mood />, t('utilityHappiness')],
      [
        this.contactHref,
        <Phone />,
        [
          t('utilityContact'),
          this.contactNumber && [
            ' ',
            <bdi class="ltr" dir="ltr">
              {this.contactNumber}
            </bdi>,
          ],
        ],
      ],
      [this.servicesHref, <GridView />, t('utilityServices'), 'docked-only'],
      [this.chatHref, <Chat />, t('utilityChat')],
      [this.accessibilityHref, <AccessibilityIcon />, t('utilityAccessibility')],
    ];
    return (
      <Host>
        <nav class="bar" part="bar" aria-labelledby="title" ref={(el) => (this.nav = el)}>
          <h2 class="title" id="title">
            {t('utilityLabel')}
          </h2>
          <ul class="list">
            {items
              .filter(([href]) => !!href)
              .map(([href, icon, label, only]) => (
                <li class={only}>
                  <a class="item focus-ring state-layer" part="item" href={href as string}>
                    {icon}
                    <span>{label}</span>
                  </a>
                </li>
              ))}
          </ul>
        </nav>
      </Host>
    );
  }
}
