import { createMachine, assign } from 'xstate';

import { getData } from '../../utils/api';
import { SHOP_UNIVERSE_ID, SHOPS_PER_PAGE } from '../../utils/constants';
import { eventError, extractArgs } from '../../utils/machines';
import { Shop } from '../../utils/types';

import {
  EventTypes,
  DataContext,
  DataEvent,
  ResponsePayload,
  DataArgs
} from './types';

const DEFAULT_CONTEXT = {
  moreAvailable: false,
  page: 0,
  results: []
};

const machineJson = {
  id: 'shopSearch',
  predictableActionArguments: true,
  context: DEFAULT_CONTEXT,
  initial: 'idle',
  states: {
    idle: {},
    searching: {
      invoke: {
        src: 'shopSearch',
        id: 'shop-search-service',
        onDone: [
          {
            cond: 'hasResults',
            target: 'results',
            actions: ['setResults', 'setPage', 'setMoreAvailable']
          },
          { target: 'noResults', actions: 'resetContext' }
        ],
        onError: { target: 'error', actions: 'resetContext' }
      }
    },
    results: {
      on: { MORE: { cond: 'hasMoreAvailable', target: 'searching' } }
    },
    noResults: {},
    error: {}
  },
  on: {
    SEARCH: [
      {
        cond: 'hasSearchParams',
        target: 'searching',
        actions: ['resetContext', 'setSearchParams']
      },
      { target: 'idle', actions: 'resetContext' }
    ]
  }
};

const machineActions = {
  resetContext: assign((...args: DataArgs) => {
    extractArgs(args);
    return {
      language: undefined,
      lat: undefined,
      lon: undefined,
      ...DEFAULT_CONTEXT
    };
  }),
  setMoreAvailable: assign((...args: DataArgs) => {
    const { event } = extractArgs(args);
    if (event.type !== EventTypes.SHOP_SEARCH)
      throw new Error(eventError(event, EventTypes.SHOP_SEARCH));
    return {
      moreAvailable: event.data.moreAvailable
    };
  }),
  setPage: assign((...args: DataArgs) => {
    const { event } = extractArgs(args);
    if (event.type !== EventTypes.SHOP_SEARCH)
      throw new Error(eventError(event, EventTypes.SHOP_SEARCH));
    return {
      page: event.data.page
    };
  }),
  setSearchParams: assign((...args: DataArgs) => {
    const { event } = extractArgs(args);
    if (event.type !== 'SEARCH') throw new Error(eventError(event, 'SEARCH'));
    return {
      language: event.language,
      lat: event.lat,
      lon: event.lon
    };
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
  hasMoreAvailable: (...args: DataArgs) => {
    const { context } = extractArgs(args);
    return context.moreAvailable;
  },
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
    const { context } = extractArgs(args);
    const { results, language, lat, lon, page } = context;
    const response = await getData<{
      shops: Shop[];
      meta: { record_count: number };
    }>(
      `shop_search?cuisines[]=kaiseki&geo_latitude=${lat}&geo_longitude=${lon}` +
        `&shop_universe_id=${SHOP_UNIVERSE_ID}&locale=${language}&page=${page}&per_page=${SHOPS_PER_PAGE}`
    );
    return {
      response: results.concat(response.shops),
      page: page + 1,
      moreAvailable: response.meta.record_count > (page + 1) * SHOPS_PER_PAGE
    };
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
