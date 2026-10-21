/**
 * The seven channels for the chrome that points to other channels: the channel switcher,
 * the footer's Channels group and the channel network strip (Standard SVC-01, CHR-03,
 * CHR-06, CHR-08). Names and descriptors live in src/i18n/components/channels.ts.
 */
import { Channel, channels } from '../i18n/core';
import type { Lang } from '../i18n/define';

export { channels };
export type { Channel };

/** Where each channel's home page is. `{lang}` in a URL is replaced with `en` or `ar`. */
export type ChannelLinks = Partial<Record<Channel, string>>;

export function isChannel(value: unknown): value is Channel {
  return typeof value === 'string' && (channels as readonly string[]).includes(value);
}

/**
 * Reads a `links` prop: an object, or a JSON string from an HTML attribute
 * (`links='{"transport":"https://…/{lang}/"}'`). Anything unreadable gives no links.
 */
export function parseLinks(value: ChannelLinks | string | undefined): ChannelLinks {
  if (!value) return {};
  if (typeof value === 'object') return value;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

/** The home page of a channel in the given language, or undefined when none was given. */
export function channelHref(links: ChannelLinks, channel: Channel, lang: Lang): string | undefined {
  return links[channel]?.replace(/\{lang\}/g, lang);
}

/**
 * The channel an element belongs to: its own `channel` prop when valid, else the closest
 * `data-channel` (crossing shadow boundaries), else Dubai Now (the token default).
 */
export function resolveChannel(el: Element, prop?: string): Channel {
  if (isChannel(prop)) return prop;
  let node: Element | null = el;
  while (node) {
    const found = node.closest('[data-channel]')?.getAttribute('data-channel');
    if (isChannel(found)) return found;
    const root = node.getRootNode() as ShadowRoot;
    node = root && root.host ? root.host : null;
  }
  return 'now';
}
