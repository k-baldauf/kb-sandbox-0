import { eventError, extractArgs } from './machines';

const event = { type: 'fake' };

describe('eventError', () => {
  test('handles a single expected event', () => {
    const result = eventError(event, 'real');
    expect(result).toBe('event is not type real: found fake instead');
  });

  test('handles multiple expected events', () => {
    const result = eventError(event, 'real', 'somewhat real', 'kinda real');
    expect(result).toBe(
      'event is not type real, somewhat real, kinda real: found fake instead'
    );
  });
});

const contextArg = 0;
const eventArg = 'foo';

describe('extractArgs', () => {
  test('converts its arguments into an object', () => {
    const result = extractArgs([contextArg, eventArg]);
    expect(result.context).toBe(0);
    expect(result.event).toBe('foo');
  });
});
