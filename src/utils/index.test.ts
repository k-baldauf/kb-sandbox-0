import { Translation } from './types';

import { getBestTranslation } from './index';

const translationA: Translation = { translation: 'A', locale: 'a' };
const translationB: Translation = { translation: 'B', locale: 'b' };
const translationA2: Translation = { translation: 'A2', locale: 'a' };

describe('getBestTranslation', () => {
  test('finds the correct translation when there is only one translation', () => {
    const result = getBestTranslation([translationA], 'a');
    expect(result?.translation).toBe('A');
  });

  test('finds the correct translation when it is first in a list', () => {
    const result = getBestTranslation([translationA, translationB], 'a');
    expect(result?.translation).toBe('A');
  });

  test('finds the correct translation when it is second in a list', () => {
    const result = getBestTranslation([translationA, translationB], 'b');
    expect(result?.translation).toBe('B');
  });

  test('returns the first translation when there is no match', () => {
    const result = getBestTranslation([translationA, translationB], 'c');
    expect(result?.translation).toBe('A');
  });

  test('returns undefined when no translations are passed in', () => {
    const result = getBestTranslation([], 'a');
    expect(result).toBeUndefined();
  });

  test('returns the first translation when multiple are a match', () => {
    const result = getBestTranslation([translationA, translationA2], 'a');
    expect(result?.translation).toBe('A');
  });
});
