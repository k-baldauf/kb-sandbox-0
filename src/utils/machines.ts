export const eventError = <T extends { type: string }>(
  event: T,
  ...expectedEvents: string[]
): string =>
  `event is not type ${expectedEvents.join(', ')}: found ${event.type} instead`;

export const extractArgs = <Context, Event>(
  args: [Context, Event]
): { context: Context; event: Event } => ({
  context: args[0],
  event: args[1]
});
