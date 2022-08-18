// The paradigms used in this file are the recommended ones as per
// the official xState documentation:
// https://xstate.js.org/docs/guides/testing.html#testing-services
// Thus we're disabling the eslint rules they break
/* eslint-disable jest/expect-expect, jest/no-done-callback, jest/no-conditional-expect */
import * as xstate from 'xstate';

import { getData } from '../../utils/api';

import { autocompleteMachine } from './machine';

jest.mock('../../utils/api', () => ({
  ...jest.requireActual('../../utils/api'),
  getData: jest.fn()
}));

afterEach(() => {
  (getData as jest.Mock).mockClear();
});

describe('autocompleteMachine', () => {
  // Pure transitions

  test('should search when a SEARCH event occurs', () => {
    const expectedValue = 'searching';

    const actualState = autocompleteMachine.transition('idle', {
      type: 'SEARCH',
      language: 'x',
      search: 'y'
    });

    expect(actualState.matches(expectedValue)).toBeTruthy();
  });

  test('should not search when a SEARCH event occurs if there is no search text', () => {
    const expectedValue = 'idle';

    const actualState = autocompleteMachine.transition('noResults', {
      type: 'SEARCH',
      language: 'x',
      search: ''
    });

    expect(actualState.matches(expectedValue)).toBeTruthy();
  });

  test('should clear when a CLEAR event occurs', () => {
    const expectedValue = 'idle';

    const actualState = autocompleteMachine.transition('results', {
      type: 'CLEAR'
    });

    expect(actualState.matches(expectedValue)).toBeTruthy();
  });

  // Service transitions

  test('should eventually reach "results" when there are locations', (done) => {
    (getData as jest.Mock).mockReturnValue({ locations: ['a', 'b'] });

    const autocompleteService = xstate
      .interpret(autocompleteMachine)
      .onTransition((state) => {
        if (state.matches('results')) {
          done();
        }
      });

    autocompleteService.start();

    autocompleteService.send({ type: 'SEARCH', language: 'x', search: 'y' });
  });

  test('should eventually reach "noResults" when there are no locations', (done) => {
    (getData as jest.Mock).mockReturnValue({ locations: [] });

    const autocompleteService = xstate
      .interpret(autocompleteMachine)
      .onTransition((state) => {
        if (state.matches('noResults')) {
          done();
        }
      });

    autocompleteService.start();

    autocompleteService.send({ type: 'SEARCH', language: 'x', search: 'y' });
  });
});
/* eslint-enable jest/expect-expect, jest/no-done-callback, jest/no-conditional-expect */
