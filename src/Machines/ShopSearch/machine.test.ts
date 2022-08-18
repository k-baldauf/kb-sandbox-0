// The paradigms used in this file are the recommended ones as per
// the official xState documentation:
// https://xstate.js.org/docs/guides/testing.html#testing-services
// Thus we're disabling the eslint rules they break
/* eslint-disable jest/expect-expect, jest/no-done-callback, jest/no-conditional-expect */
import * as xstate from 'xstate';

import { getData } from '../../utils/api';

import { shopSearchMachine } from './machine';

jest.mock('../../utils/api', () => ({
  ...jest.requireActual('../../utils/api'),
  getData: jest.fn()
}));

afterEach(() => {
  (getData as jest.Mock).mockClear();
});

describe('shopSearchMachine', () => {
  // Pure transitions

  test('should search when a SEARCH event occurs', () => {
    const expectedValue = 'searching';

    const actualState = shopSearchMachine.transition('idle', {
      type: 'SEARCH',
      language: 'x',
      lat: 0,
      lon: 0
    });

    expect(actualState.matches(expectedValue)).toBeTruthy();
  });

  test('should not search when a SEARCH event occurs if a parameter is missing', () => {
    const expectedValue = 'idle';

    const actualState = shopSearchMachine.transition('noResults', {
      type: 'SEARCH',
      language: '',
      lat: 0,
      lon: 0
    });

    expect(actualState.matches(expectedValue)).toBeTruthy();
  });

  test('should not search MORE from noResults', () => {
    const expectedValue = 'noResults';

    const actualState = shopSearchMachine.transition('noResults', {
      type: 'MORE'
    });

    expect(actualState.matches(expectedValue)).toBeTruthy();
  });

  test('should not search when a CHANGEFILTER event occurs with no context', () => {
    const expectedValue = 'noResults';

    const actualState = shopSearchMachine.transition('noResults', {
      type: 'CHANGEFILTER',
      tag: 'a',
      filter: 'tags'
    });

    expect(actualState.matches(expectedValue)).toBeTruthy();
  });

  // Service transitions

  test('should eventually reach "results" when there are shops', (done) => {
    (getData as jest.Mock).mockReturnValue({
      shops: ['a', 'b'],
      meta: { record_count: 0 }
    });

    const shopSearchService = xstate
      .interpret(shopSearchMachine)
      .onTransition((state) => {
        if (state.matches('results')) {
          done();
        }
      });

    shopSearchService.start();

    shopSearchService.send({ type: 'SEARCH', language: 'x', lat: 0, lon: 0 });
  });

  test('should eventually reach "noResults" when there are no shops', (done) => {
    (getData as jest.Mock).mockReturnValue({
      shops: [],
      meta: { record_count: 0 }
    });

    const shopSearchService = xstate
      .interpret(shopSearchMachine)
      .onTransition((state) => {
        if (state.matches('noResults')) {
          done();
        }
      });

    shopSearchService.start();

    shopSearchService.send({ type: 'SEARCH', language: 'x', lat: 0, lon: 0 });
  });

  test('can change a filter to reset and rerun the search', (done) => {
    (getData as jest.Mock).mockReturnValue({
      shops: ['a', 'b'],
      meta: { record_count: 101 }
    });

    let hasReachedResultsOnce = false;

    const shopSearchService = xstate
      .interpret(shopSearchMachine)
      .onTransition((state) => {
        if (state.matches('results') && !hasReachedResultsOnce) {
          hasReachedResultsOnce = true;
          expect(state.context.results).toEqual(['a', 'b']);
          expect(state.context.page).toBe(1);
          expect(state.context.tags).toEqual([]);
          shopSearchService.send({
            type: 'CHANGEFILTER',
            tag: 'x',
            filter: 'tags'
          });
        } else if (state.matches('searching') && hasReachedResultsOnce) {
          expect(state.context.results).toEqual([]);
          expect(state.context.page).toBe(0);
          expect(state.context.tags).toEqual(['x']);
          done();
        }
      });

    shopSearchService.start();

    shopSearchService.send({ type: 'SEARCH', language: 'x', lat: 0, lon: 0 });
  });
});
/* eslint-enable jest/expect-expect, jest/no-done-callback, jest/no-conditional-expect */
