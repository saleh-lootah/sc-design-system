import { defineStrings } from '../define';

/**
 * sc-button (v2). Imported directly by sc-button only, never through ./index.ts.
 * `buttonLoading` is the visually hidden word inside the busy button (overridable with the
 * `loading-text` prop); `buttonLoadingStatus` is the polite announcement around it.
 * Keys keep the component prefix, because the legacy merged dictionary still lists this file.
 */
export default defineStrings({
  en: {
    buttonLoading: 'Loading',
    buttonLoadingStatus: '{label}, {loading}',
  },
  ar: {
    buttonLoading: 'جارٍ التحميل',
    buttonLoadingStatus: '{label}، {loading}',
  },
});
