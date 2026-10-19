import { Component, Element, Host, Prop, Watch, h } from '@stencil/core';
import { LocaleController } from '../../i18n/locale';
import { Channel, channelKey, channels } from '../../i18n/strings';
import { ChevronForward } from '../../icons/index'; // explicit /index: see CONTRIBUTING

/**
 * Points to another channel that also offers this service: "Also on Dubai Transport".
 *
 * The chip sets `data-channel` on itself, so it shows that channel's subtle and ink
 * colours whatever channel the page is in. This is the one component allowed to name
 * a channel. With `href` it is a link to the service on that channel.
 *
 * @slot - Optional custom text, used instead of "Also on {channel}". Name the channel.
 *
 * @part chip - The pill (`<a>` with `href`, otherwise `<span>`).
 * @part dot - The channel dot.
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

  private locale = new LocaleController(this);

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
    const name = channel ? t(channelKey(channel)) : '';
    const text = this.label || (channel ? t('alsoOn', { channel: name }) : '');
    const content = [
      <span class="dot" part="dot" aria-hidden="true"></span>,
      <span class="label">
        <slot>{text}</slot>
      </span>,
    ];

    return (
      <Host>
        {this.href ? (
          <a class="chip chip--link type-label-s focus-ring" part="chip" href={this.href}>
            {content}
            <span class="chevron" part="icon">
              <ChevronForward />
            </span>
          </a>
        ) : (
          <span class="chip type-label-s" part="chip">
            {content}
          </span>
        )}
      </Host>
    );
  }
}
