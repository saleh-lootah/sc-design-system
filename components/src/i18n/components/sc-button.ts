import { defineStrings } from '../define';

/**
 * sc-button. The word itself is `loading` from common.ts (overridable with the
 * `loading-text` prop); this key is the announcement around it. Prefix every key with the component name so files never collide.
 */
export default defineStrings({
  en: {
    buttonLoadingStatus: '{label}, {loading}',
  },
  ar: {
    buttonLoadingStatus: '{label}، {loading}',
  },
});
