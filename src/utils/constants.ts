import { LocaleCode, ordered as orderedLocales } from '@tablecheck/locales';

export const SUPPORTED_LOCALES = orderedLocales.map(({ code }) => code);
export const DEFAULT_LOCALE = LocaleCode.English;

export const SHOP_UNIVERSE_ID = '57e0b91744aea12988000001'; // Japan
