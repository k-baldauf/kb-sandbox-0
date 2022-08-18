// The paradigms used in this file are the recommended ones as per
// the official xState documentation:
// https://xstate.js.org/docs/guides/testing.html#testing-services
// Thus we're disabling the eslint rules they break
/* eslint-disable jest/expect-expect, jest/no-done-callback, jest/no-conditional-expect */
import * as xstate from 'xstate';

import { getData } from '../../utils/api';

import { shopSlideoutMachine } from './machine';

jest.mock('../../utils/api', () => ({
  ...jest.requireActual('../../utils/api'),
  getData: jest.fn()
}));

afterEach(() => {
  (getData as jest.Mock).mockClear();
});

describe('shopSlideoutMachine', () => {
  // Pure transitions

  test('should start to open when an OPEN event occurs', () => {
    const expectedValue = 'opening';

    const actualState = shopSlideoutMachine.transition('closed', {
      type: 'OPEN',
      language: 'x',
      id: 'y'
    });

    expect(actualState.matches(expectedValue)).toBeTruthy();
  });

  test('should not open when an OPEN event occurs if a parameter is missing', () => {
    const expectedValue = 'closed';

    const actualState = shopSlideoutMachine.transition('error', {
      type: 'OPEN',
      language: 'x',
      id: ''
    });

    expect(actualState.matches(expectedValue)).toBeTruthy();
  });

  test('should close when a CLOSE event occurs', () => {
    const expectedValue = 'closed';

    const actualState = shopSlideoutMachine.transition('open', {
      type: 'CLOSE'
    });

    expect(actualState.matches(expectedValue)).toBeTruthy();
  });

  // Service transitions

  test('should eventually reach "open" when there is one shop', (done) => {
    (getData as jest.Mock).mockReturnValue({
      shops: ['a']
    });

    const shopSlideoutService = xstate
      .interpret(shopSlideoutMachine)
      .onTransition((state) => {
        if (state.matches('open')) {
          done();
        }
      });

    shopSlideoutService.start();

    shopSlideoutService.send({ type: 'OPEN', language: 'x', id: 'y' });
  });

  test('should "error" when there is more than one shop', (done) => {
    (getData as jest.Mock).mockReturnValue({
      shops: ['a', 'b']
    });

    const shopSlideoutService = xstate
      .interpret(shopSlideoutMachine)
      .onTransition((state) => {
        if (state.matches('error')) {
          done();
        }
      });

    shopSlideoutService.start();

    shopSlideoutService.send({ type: 'OPEN', language: 'x', id: 'y' });
  });

  test('should "error" when there are no shops', (done) => {
    (getData as jest.Mock).mockReturnValue({
      shops: []
    });

    const shopSlideoutService = xstate
      .interpret(shopSlideoutMachine)
      .onTransition((state) => {
        if (state.matches('error')) {
          done();
        }
      });

    shopSlideoutService.start();

    shopSlideoutService.send({ type: 'OPEN', language: 'x', id: 'y' });
  });

  test('should be able to skip "opening" when reopening the previous shop', (done) => {
    (getData as jest.Mock).mockReturnValue({
      shops: [{ _id: 'a' }]
    });

    let hasReachedOpenOnce = false;

    const shopSlideoutService = xstate
      .interpret(shopSlideoutMachine)
      .onTransition((state) => {
        if (state.matches('open')) {
          if (!hasReachedOpenOnce) {
            hasReachedOpenOnce = true;
            shopSlideoutService.send({ type: 'CLOSE' });
          } else {
            expect(getData).toHaveBeenCalledTimes(1);
            done();
          }
        } else if (state.matches('closed')) {
          if (hasReachedOpenOnce) {
            shopSlideoutService.send({ type: 'OPEN', language: 'x', id: 'a' });
          }
        }
      });

    shopSlideoutService.start();

    shopSlideoutService.send({ type: 'OPEN', language: 'x', id: 'y' });
  });
});
/* eslint-enable jest/expect-expect, jest/no-done-callback, jest/no-conditional-expect */
