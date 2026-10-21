import { Component, Element, Host, Prop, Watch, h } from '@stencil/core';
import { LocaleController } from '../../i18n/controller';
import strings from '../../i18n/components/sc-channel-chip';
import { Channel, channels } from '../../i18n/core';
import { ChevronForward } from '../../icons/for/sc-channel-chip';

export type ChannelChipVariant = 'subtle' | 'outlined';

/** `transport` → `channelChipTransport`. */
const nameKey = (channel: Channel) => `channelChip${channel.charAt(0).toUpperCase()}${channel.slice(1)}` as 'channelChipNow';

/**
 * Points to another channel that also offers this service: "Also on Dubai Transport".
 *
 * The chip sets `data-channel` on itself, so it shows that channel's colours whatever
 * channel the page is in. This is the one component allowed to name a channel; other
 * channels' colours appear only as attribution like this. With `href` it is a link to the
 * service on that channel, with a 44px hit area that does not change the layout.
 * Channel chips are never dismissable.
 *
 * @slot - Optional custom text, used instead of "Also on {channel}". Name the channel.
 *
 * @part chip - The chip (`<a>` with `href`, otherwise `<span>`).
 * @part dot - The 8px channel dot.
 * @part icon - The end chevron (links only; mirrors in right-to-left).
 */
@Component({
  tag: 'sc-channel-chip',
  styleUrl: 'sc-channel-chip.css',
  shadow: { delegatesFocus: true },
})
export class ScChannelChip {
  @Element() el!: HTMLElement;

  /** The channel to point to: `now`, `transport`, `visit`, `justice`, `build`, `invest` or `trade`. */
  @Prop({ reflect: true }) channel!: Channel;

  /** Makes the chip a link to the service on that channel. */
  @Prop() href?: string;

  /** Overrides the text (default "Also on {channel}" / "متوفر أيضًا في {channel}" from strings). */
  @Prop() label?: string;

  /**
   * - `subtle` (default): the channel's subtle tint, for white cards.
   * - `outlined`: a white chip with a 1px channel outline and a Bold label, for chips that
   *   sit on a channel tint (life-event rows, "On Dubai Transport").
   */
  @Prop({ reflect: true }) variant: ChannelChipVariant = 'subtle';

  private locale = new LocaleController(this, strings);

  connectedCallback() {
    this.locale.connect();
    this.syncChannel();
  }

  disconnectedCallback() {
    this.locale.disconnect();
  }

  @Watch('channel')
  syncChannel() {
    if (this.validChannel) this.el.setAttribute('data-channel', this.validChannel);
    else this.el.removeAttribute('data-channel');
  }

  private get validChannel(): Channel | undefined {
    return (channels as readonly string[]).includes(this.channel) ? this.channel : undefined;
  }

  render() {
    const { t } = this.locale;
    const channel = this.validChannel;
    const text = this.label || (channel ? t('channelChipAlsoOn', { channel: t(nameKey(channel)) }) : '');
    const classes = { 'chip': true, 'chip--outlined': this.variant === 'outlined', 'chip--link': !!this.href, 'focus-ring': !!this.href };
    const content = [
      <span class="dot" part="dot" aria-hidden="true"></span>,
      <span class="label">
        <slot>{text}</slot>
      </span>,
    ];

    return (
      <Host>
        {this.href ? (
          <a class={classes} part="chip" href={this.href}>
            {content}
            <span class="chevron" part="icon">
              <ChevronForward />
            </span>
          </a>
        ) : (
          <span class={classes} part="chip">
            {content}
          </span>
        )}
      </Host>
    );
  }
}
