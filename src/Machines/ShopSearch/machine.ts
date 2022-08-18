import { createMachine, assign } from 'xstate';

import { getData } from '../../utils/api';
import { SHOP_UNIVERSE_ID, SHOPS_PER_PAGE } from '../../utils/constants';
import { eventError, extractArgs } from '../../utils/machines';
import { Shop } from '../../utils/types';

import {
  EventType,
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
  context: { ...DEFAULT_CONTEXT, tags: [], cuisines: [] },
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
    CHANGEFILTER: [
      {
        cond: 'canRerunSearch',
        target: 'searching',
        actions: ['changeFilter', 'setContextToRerunSearch']
      },
      { actions: 'changeFilter' }
    ],
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
  changeFilter: assign((...args: DataArgs) => {
    const { context, event } = extractArgs(args);
    if (event.type !== 'CHANGEFILTER')
      throw new Error(eventError(event, 'CHANGEFILTER'));
    const index = context[event.filter].indexOf(event.tag);
    return {
      // I couldn't figure out how to format the url parameter, so limit this to one for now
      [event.filter]: index === -1 ? [event.tag] : []
    };
  }),
  resetContext: assign((...args: DataArgs) => {
    extractArgs(args);
    return {
      language: undefined,
      lat: undefined,
      lon: undefined,
      ...DEFAULT_CONTEXT
    };
  }),
  setContextToRerunSearch: assign((...args: DataArgs) => {
    const { context } = extractArgs(args);
    return {
      ...context,
      ...DEFAULT_CONTEXT
    };
  }),
  setMoreAvailable: assign((...args: DataArgs) => {
    const { event } = extractArgs(args);
    if (event.type !== EventType.ShopSearch)
      throw new Error(eventError(event, EventType.ShopSearch));
    return {
      moreAvailable: event.data.moreAvailable
    };
  }),
  setPage: assign((...args: DataArgs) => {
    const { event } = extractArgs(args);
    if (event.type !== EventType.ShopSearch)
      throw new Error(eventError(event, EventType.ShopSearch));
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
    if (event.type !== EventType.ShopSearch)
      throw new Error(eventError(event, EventType.ShopSearch));
    return {
      results: event.data.response
    };
  })
};

const machineGuards = {
  canRerunSearch: (...args: DataArgs) => {
    const { context } = extractArgs(args);
    return (
      !!context.language &&
      typeof context.lat === 'number' &&
      typeof context.lon === 'number'
    );
  },
  hasMoreAvailable: (...args: DataArgs) => {
    const { context } = extractArgs(args);
    return context.moreAvailable;
  },
  hasResults: (...args: DataArgs) => {
    const { event } = extractArgs(args);
    if (event.type !== EventType.ShopSearch)
      throw new Error(eventError(event, EventType.ShopSearch));
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
    const { results, language, lat, lon, page, cuisines, tags } = context;
    const cuisinesArg = cuisines.length
      ? `&cuisines[]=${cuisines.join(',')}`
      : '';
    const tagsArg = tags.length ? `&tags[]=${tags.join(',')}` : '';
    const response = await getData<{
      shops: Shop[];
      meta: { record_count: number };
    }>(
      `shop_search?geo_latitude=${lat}&geo_longitude=${lon}&shop_universe_id=${SHOP_UNIVERSE_ID}` +
        `&locale=${language}&page=${page}&per_page=${SHOPS_PER_PAGE}${tagsArg}${cuisinesArg}`
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
