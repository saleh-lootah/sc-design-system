import { defineStrings } from '../define';
import common from './common';

/**
 * The seven channels' one-line descriptors, for the chrome that points to other channels:
 * sc-channel-switcher and sc-channel-network. Descriptors are the working taxonomy (Standard
 * OQ-13). The channel NAMES are not here: they are the official ones in ./common.ts
 * (`channel<Channel>`, Standard 3.1), and `channelStrings()` merges them in.
 */
const descriptors = defineStrings({
  en: {
    chNowDesc: 'Services for everyone who lives in Dubai',
    chTransportDesc: 'Driving, vehicles and roads',
    chVisitDesc: 'Visitors and events',
    chJusticeDesc: 'Courts and legal services',
    chBuildDesc: 'Planning and construction',
    chInvestDesc: 'Start and run a business',
    chTradeDesc: 'Import, export and customs',
  },
  ar: {
    chNowDesc: 'خدمات لكل من يعيش في دبي',
    chTransportDesc: 'القيادة والمركبات والطرق',
    chVisitDesc: 'الزوار والفعاليات',
    chJusticeDesc: 'المحاكم والخدمات القانونية',
    chBuildDesc: 'التخطيط والبناء',
    chInvestDesc: 'تأسيس الأعمال وإدارتها',
    chTradeDesc: 'الاستيراد والتصدير والجمارك',
  },
});

const cap = (channel: string) => `${channel[0].toUpperCase()}${channel.slice(1)}`;
/** The key of a channel's official name in common.ts: `now` → `channelNow`. */
export const nameKey = (channel: string) => `channel${cap(channel)}` as 'channelNow';
/** The key of a channel's descriptor: `now` → `chNowDesc`. */
export const descKey = (channel: string) => `ch${cap(channel)}Desc` as 'chNowDesc';

const names = (d: typeof common.en) => ({
  channelNow: d.channelNow,
  channelTransport: d.channelTransport,
  channelVisit: d.channelVisit,
  channelJustice: d.channelJustice,
  channelBuild: d.channelBuild,
  channelInvest: d.channelInvest,
  channelTrade: d.channelTrade,
});

/** A component's own strings plus the official channel names (common.ts) and the descriptors. */
export function channelStrings<E extends Record<string, string>>(own: { en: E; ar: { [K in keyof E]: string } }) {
  return {
    en: { ...own.en, ...names(common.en), ...descriptors.en },
    ar: { ...own.ar, ...names(common.ar), ...descriptors.ar },
  };
}

export default descriptors;
