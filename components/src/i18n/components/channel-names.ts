import { defineStrings } from '../define';

/**
 * The seven channels' official names (Standard 3.1), on their own so the chrome that names a
 * channel but never describes one (sc-app-bar, sc-footer) bundles only these: not the rest of
 * ./common.ts, and not the descriptors in ./channels.ts, which sc-channel-switcher and
 * sc-channel-network add. common.ts spreads them in under the same keys for the legacy merged
 * dictionary. Import this file directly, not through ./channels.ts, or the descriptors come too.
 */
const channelNames = defineStrings({
  en: {
    channelNow: 'Dubai Now',
    channelTransport: 'Dubai Transport',
    channelVisit: 'Visit Dubai',
    channelJustice: 'Dubai Justice',
    channelBuild: 'Build in Dubai',
    channelInvest: 'Invest in Dubai',
    channelTrade: 'Dubai Trade',
  },
  ar: {
    channelNow: 'دبي الآن',
    channelTransport: 'مواصلات دبي',
    channelVisit: 'زوروا دبي',
    channelJustice: 'دبي للعدالة',
    channelBuild: 'دبي للبناء',
    channelInvest: 'استثمر في دبي',
    channelTrade: 'دبي التجارية',
  },
});

export default channelNames;

export const cap = (channel: string) => `${channel[0].toUpperCase()}${channel.slice(1)}`;
/** The key of a channel's official name: `now` → `channelNow`. */
export const nameKey = (channel: string) => `channel${cap(channel)}` as 'channelNow';

/** A component's own strings plus the official channel names. */
export function channelNameStrings<E extends Record<string, string>>(own: { en: E; ar: { [K in keyof E]: string } }) {
  return {
    en: { ...own.en, ...channelNames.en },
    ar: { ...own.ar, ...channelNames.ar },
  };
}
