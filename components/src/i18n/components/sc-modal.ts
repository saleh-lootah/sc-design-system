import { defineStrings } from '../define';

/**
 * sc-modal (v2). The close button's name, and the session-timeout countdown (TIME-02):
 * `modalTimeLeft` is the visible line; the announcement uses the plural forms below and is
 * spoken only at whole minutes and at 30 and 10 seconds, never every second. Arabic plural
 * forms follow Intl.PluralRules('ar') (LANG-23).
 */
export default defineStrings({
  en: {
    modalClose: 'Close',
    modalTimeLeft: 'Time left: {time}',
    modalAnnounce: '{time} left',
    modalMinutesOne: '1 minute',
    modalMinutesTwo: '2 minutes',
    modalMinutesFew: '{n} minutes',
    modalMinutesMany: '{n} minutes',
    modalMinutesOther: '{n} minutes',
    modalSecondsOne: '1 second',
    modalSecondsTwo: '2 seconds',
    modalSecondsFew: '{n} seconds',
    modalSecondsMany: '{n} seconds',
    modalSecondsOther: '{n} seconds',
    modalAnd: '{minutes} and {seconds}',
  },
  ar: {
    modalClose: 'إغلاق',
    modalTimeLeft: 'الوقت المتبقي: {time}',
    modalAnnounce: 'متبقٍ {time}',
    modalMinutesOne: 'دقيقة واحدة',
    modalMinutesTwo: 'دقيقتان',
    modalMinutesFew: '{n} دقائق',
    modalMinutesMany: '{n} دقيقة',
    modalMinutesOther: '{n} دقيقة',
    modalSecondsOne: 'ثانية واحدة',
    modalSecondsTwo: 'ثانيتان',
    modalSecondsFew: '{n} ثوانٍ',
    modalSecondsMany: '{n} ثانية',
    modalSecondsOther: '{n} ثانية',
    modalAnd: '{minutes} و{seconds}',
  },
});
