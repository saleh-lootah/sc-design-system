import { defineStrings } from '../define';

/**
 * sc-step-progress (v2, the E stepper). `stepProgressCount` is the compact meta row;
 * the others build each step's state line in the full layout ("Step 1 · Done"). The
 * upcoming state is visually hidden, so every step says its state in words (A11Y-06).
 */
export default defineStrings({
  en: {
    stepProgressCount: 'Step {current} of {total}',
    stepProgressStep: 'Step {n}',
    stepProgressDone: 'Done',
    stepProgressCurrent: 'Current',
    stepProgressUpcoming: 'Not started',
    stepProgressLabel: 'Steps',
  },
  ar: {
    stepProgressCount: 'الخطوة {current} من {total}',
    stepProgressStep: 'الخطوة {n}',
    stepProgressDone: 'مكتملة',
    stepProgressCurrent: 'الحالية',
    stepProgressUpcoming: 'لم تبدأ',
    stepProgressLabel: 'الخطوات',
  },
});
