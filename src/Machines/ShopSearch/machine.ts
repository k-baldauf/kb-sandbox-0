import { createMachine, assign } from 'xstate';

import { getData } from 'utils/api';
import { SHOP_UNIVERSE_ID } from 'utils/constants';
import { eventError, extractArgs } from 'utils/machines';
import { Shop } from 'utils/types';

import {
  EventTypes,
  DataContext,
  DataEvent,
  ResponsePayload,
  DataArgs
} from './types';

const machineJson = {
  id: 'shopSearch',
  predictableActionArguments: true,
  context: {
    results: []
  },
  initial: 'idle',
  states: {
    idle: {},
    searching: {
      invoke: {
        src: 'shopSearch',
        id: 'shop-search-service',
        onDone: [
          { cond: 'hasResults', target: 'results', actions: 'setResults' },
          { target: 'noResults', actions: 'clearResults' }
        ],
        onError: { target: 'error' }
      }
    },
    results: {},
    noResults: {},
    error: {}
  },
  on: {
    SEARCH: [
      { cond: 'hasSearchParams', target: 'searching' },
      { target: 'idle', actions: 'clearResults' }
    ]
  }
};

const machineActions = {
  clearResults: assign((...args: DataArgs) => {
    extractArgs(args);
    return { results: [] };
  }),
  setResults: assign((...args: DataArgs) => {
    const { event } = extractArgs(args);
    if (event.type !== EventTypes.SHOP_SEARCH)
      throw new Error(eventError(event, EventTypes.SHOP_SEARCH));
    return {
      results: event.data.response
    };
  })
};

const machineGuards = {
  hasResults: (...args: DataArgs) => {
    const { event } = extractArgs(args);
    if (event.type !== EventTypes.SHOP_SEARCH)
      throw new Error(eventError(event, EventTypes.SHOP_SEARCH));
    return !!event.data.response.length;
  },
  hasSearchParams: (...args: DataArgs) => {
    const { event } = extractArgs(args);
    if (event.type !== 'SEARCH') throw new Error(eventError(event, 'SEARCH'));
    return (
      !!event.language &&
      typeof event.lat === 'number' &&
      typeof event.lon === 'number'
    );
  }
};

const machineServices = {
  shopSearch: async (...args: DataArgs): Promise<ResponsePayload> => {
    const { event } = extractArgs(args);
    if (event.type !== 'SEARCH') throw new Error(eventError(event, 'SEARCH'));
    const { language, lat, lon } = event;
    const response = await getData<{ shops: Shop[] }>(
      `shop_search?cuisines[]=kaiseki&geo_latitude=${lat}&geo_longitude=${lon}` +
        `&shop_universe_id=${SHOP_UNIVERSE_ID}&locale=${language}&per_page=50`
    );
    return { response: response.shops };
  }
};

const machineOptions = {
  actions: machineActions,
  guards: machineGuards,
  services: machineServices
};

export const shopSearchMachine = createMachine<DataContext, DataEvent>(
  machineJson,
  machineOptions
);
