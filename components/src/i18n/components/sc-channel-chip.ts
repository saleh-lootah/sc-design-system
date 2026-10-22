import { defineStrings } from '../define';

/**
 * sc-channel-chip (v2): "Also on {channel}" and the seven channel names, keyed by the
 * `data-channel` value. Overridable with the `label` prop or the default slot.
 */
export default defineStrings({
  en: {
    channelChipAlsoOn: 'Also on {channel}',
    channelChipNow: 'Dubai Now',
    channelChipTransport: 'Dubai Transport',
    channelChipVisit: 'Visit Dubai',
    channelChipJustice: 'Dubai Justice',
    channelChipBuild: 'Build in Dubai',
    channelChipInvest: 'Invest in Dubai',
    channelChipTrade: 'Dubai Trade',
  },
  ar: {
    channelChipAlsoOn: 'متوفر أيضًا في {channel}',
    channelChipNow: 'دبي الآن',
    channelChipTransport: 'مواصلات دبي',
    channelChipVisit: 'زوروا دبي',
    channelChipJustice: 'دبي للعدالة',
    channelChipBuild: 'دبي للبناء',
    channelChipInvest: 'استثمر في دبي',
    channelChipTrade: 'دبي التجارية',
  },
});
