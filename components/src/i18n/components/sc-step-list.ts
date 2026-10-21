import { defineStrings } from '../define';

/**
 * sc-step-list (v2, the E1 life-event list). The attribution chip on a step that belongs
 * to another channel ("On Dubai Transport"), with the seven channel names (3.1).
 */
export default defineStrings({
  en: {
    stepListOn: 'On {channel}',
    stepListChannelNow: 'Dubai Now',
    stepListChannelTransport: 'Dubai Transport',
    stepListChannelVisit: 'Visit Dubai',
    stepListChannelJustice: 'Dubai Justice',
    stepListChannelBuild: 'Build in Dubai',
    stepListChannelInvest: 'Invest in Dubai',
    stepListChannelTrade: 'Dubai Trade',
  },
  ar: {
    stepListOn: 'على {channel}',
    stepListChannelNow: 'دبي الآن',
    stepListChannelTransport: 'مواصلات دبي',
    stepListChannelVisit: 'زوروا دبي',
    stepListChannelJustice: 'عدالة دبي',
    stepListChannelBuild: 'ابنِ في دبي',
    stepListChannelInvest: 'استثمر في دبي',
    stepListChannelTrade: 'دبي التجارية',
  },
});
