import { defineStrings } from '../define';

/**
 * sc-tile (v2): the count under a tile's title. Plural forms are separated by `|`:
 * English one|other; Arabic zero|one|two|few|many|other (counted nouns change form with
 * the number). Override per tile with `count-label`. Imported only by sc-tile.
 */
export default defineStrings({
  en: {
    tileCount: '{count} service|{count} services',
  },
  ar: {
    tileCount: 'لا توجد خدمات|خدمة واحدة|خدمتان|{count} خدمات|{count} خدمة|{count} خدمة',
  },
});
