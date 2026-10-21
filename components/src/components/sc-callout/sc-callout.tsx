import { Component, Element, Host, Prop, State, h } from '@stencil/core';
import { LocaleController } from '../../i18n/controller';
import strings from '../../i18n/components/sc-callout';
import { AlertCircle, CheckCircle, Info, Warning } from '../../icons/for/sc-callout';

export type CalloutTone = 'info' | 'success' | 'warning' | 'error';
export type CalloutHeadingLevel = 2 | 3 | 4 | 5 | 6;

const TONES: readonly CalloutTone[] = ['info', 'success', 'warning', 'error'];

const TONE_KEYS = {
  info: 'calloutInfo',
  success: 'calloutSuccess',
  warning: 'calloutWarning',
  error: 'calloutError',
} as const;

const TONE_ICONS = { info: Info, success: CheckCircle, warning: Warning, error: AlertCircle };

/**
 * An important message that sits in the page content: something the user must know
 * before they act ("If your payment is interrupted, don't pay again…"), or the outcome
 * of what they just did.
 *
 * v2: a tone-95 container with an 8px radius, a tone-coloured accent bar at inline-start,
 * a 24px tone icon and the content in `on-surface`. Each tone also has a visually hidden
 * word ("Warning:"), so the meaning never relies on colour or the icon alone. Links inside
 * keep the channel link colour.
 *
 * @slot - The message. Plain text or inline content (links, `<sc-ltr>`); paragraphs are fine.
 * @slot heading - Optional rich heading, used instead of the `heading` prop.
 *
 * @part container - The box.
 * @part icon - The icon wrapper.
 * @part heading - The heading.
 * @part content - The wrapper around the default slot.
 */
@Component({
  tag: 'sc-callout',
  styleUrl: 'sc-callout.css',
  shadow: true,
})
export class ScCallout {
  @Element() el!: HTMLElement;

  /**
   * What kind of message it is.
   * - `info`: guidance and reassurance (info blue).
   * - `success`: something worked ("Payment received").
   * - `warning`: something the user must know to avoid a problem.
   * - `error`: something went wrong and the user can't continue as planned.
   */
  @Prop({ reflect: true }) tone: CalloutTone = 'info';

  /** Optional short heading in bold above the message. */
  @Prop() heading?: string;

  /**
   * Renders the heading as `<h2>`–`<h6>`. Leave it unset to render the heading as plain
   * bold text, which is right for most callouts inside a form.
   */
  @Prop() headingLevel?: CalloutHeadingLevel;

  /** Overrides the visually hidden tone word read before the message (default from strings, e.g. "Warning:"). */
  @Prop() toneLabel?: string;

  /** True when content is slotted into `heading`. */
  @State() hasHeadingSlot = false;

  private locale = new LocaleController(this, strings);

  connectedCallback() {
    this.locale.connect();
    this.hasHeadingSlot = Array.from(this.el.children).some((c) => c.getAttribute('slot') === 'heading');
  }

  disconnectedCallback() {
    this.locale.disconnect();
  }

  private onHeadingSlotChange = (ev: Event) => {
    this.hasHeadingSlot = (ev.target as HTMLSlotElement).assignedNodes().length > 0;
  };

  render() {
    const { t } = this.locale;
    const tone = TONES.includes(this.tone) ? this.tone : 'info';
    const ToneIcon = TONE_ICONS[tone];
    const prefix = this.toneLabel || t(TONE_KEYS[tone]);
    const hasHeading = !!this.heading || this.hasHeadingSlot;
    const level = Number(this.headingLevel);
    const HeadingTag = (level >= 2 && level <= 6 ? `h${level}` : 'p') as 'p';

    return (
      <Host>
        <div class={{ callout: true, [`callout--${tone}`]: true }} part="container">
          <span class="icon-box" part="icon">
            <ToneIcon />
          </span>
          <div class="body">
            <HeadingTag class={{ 'heading': true, 'heading--empty': !hasHeading }} part="heading">
              <span class="visually-hidden">{prefix} </span>
              <slot name="heading" onSlotchange={this.onHeadingSlotChange}>
                {this.heading}
              </slot>
            </HeadingTag>
            <div class="content" part="content">
              {!hasHeading && <span class="visually-hidden">{prefix} </span>}
              <slot />
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
