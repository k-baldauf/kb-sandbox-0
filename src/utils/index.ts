import { Translation } from './types';

/**
 * getBestTranslations
 *
 * Takes a list of translations and returns the one matching the current language.
 * If there are multiple matches, the first one is returned.
 * If there are no matches, the first item in `translations` is returned regardless of its language.
 * (I wasn't sure what the expected behavior would be in these cases, but depending on product specs we can modify
 * the behavior of the entire app by updating this function.)
 *
 * @param translations The list of translations to pick between
 * @param language The user's current language
 * @returns A single translation matching the language, or the endpoint's best guess
 */
export const getBestTranslation = (
  translations: Translation[],
  language: string
): Translation | undefined => {
  if (!translations.length) return undefined;
  return (
    translations.find((translation) => translation.locale === language) ||
    translations[0]
  );
};
