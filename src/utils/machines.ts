/**
 * eventError
 *
 * Formats a string for easier debugging when an event does not match the expected types.
 * Does not throw the error, does not do the event testing.
 *
 * @param event The xstate DataEvent
 * @param expectedEvents Any number of strings that the event.type was expected to match one of
 * @returns An error message to throw when the event doesn't match the list of expected events
 */
export const eventError = <T extends { type: string }>(
  event: T,
  ...expectedEvents: string[]
): string =>
  `event is not type ${expectedEvents.join(', ')}: found ${event.type} instead`;

/**
 * extractArgs
 *
 * A helper function to easily convert xstate action, guard, and service arguments into an object,
 * both for extraction and to avoid linter issues regarding unused arguments.
 *
 * @param args The expected args for an xstate machine, matching the form [DataContext, DataEvent]
 * @returns An object with the keys 'context' and 'event' for simple full or partial destructuring
 */
export const extractArgs = <Context, Event>(
  args: [Context, Event]
): { context: Context; event: Event } => ({
  context: args[0],
  event: args[1]
});
