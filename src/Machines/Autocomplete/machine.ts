import { createMachine, assign } from 'xstate';

import { getData } from 'utils/api';
import { SHOP_UNIVERSE_ID } from 'utils/constants';
import { eventError, extractArgs } from 'utils/machines';
import { AutocompleteResponse } from 'utils/types';

import {
  EventTypes,
  DataContext,
  DataEvent,
  ResponsePayload,
  DataArgs
} from './types';

const machineJson = {
  id: 'autocomplete',
  predictableActionArguments: true,
  context: {
    results: null
  },
  initial: 'idle',
  states: {
    idle: {},
    searching: {
      invoke: {
        src: 'autocompleteSearch',
        id: 'autocomplete-search-service',
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
    return { results: null };
  }),
  setResults: assign((...args: DataArgs) => {
    const { event } = extractArgs(args);
    if (event.type !== EventTypes.AUTOCOMPLETE_SEARCH)
      throw new Error(eventError(event, EventTypes.AUTOCOMPLETE_SEARCH));
    return {
      results: event.data.response
    };
  })
};

const machineGuards = {
  hasResults: (...args: DataArgs) => {
    const { event } = extractArgs(args);
    if (event.type !== EventTypes.AUTOCOMPLETE_SEARCH)
      throw new Error(eventError(event, EventTypes.AUTOCOMPLETE_SEARCH));
    return !!event.data.response.locations?.length;
  },
  hasSearchParams: (...args: DataArgs) => {
    const { event } = extractArgs(args);
    if (event.type !== 'SEARCH') throw new Error(eventError(event, 'SEARCH'));
    return !!event.language && !!event.search;
  }
};

const machineServices = {
  autocompleteSearch: async (...args: DataArgs): Promise<ResponsePayload> => {
    const { event } = extractArgs(args);
    if (event.type !== 'SEARCH') throw new Error(eventError(event, 'SEARCH'));
    const { language, search } = event;
    const response = await getData<AutocompleteResponse>(
      `autocomplete?locale=${language}&shop_universe_id=${SHOP_UNIVERSE_ID}&text=${search}`
    );
    return { response };
  }
};

const machineOptions = {
  actions: machineActions,
  guards: machineGuards,
  services: machineServices
};

export const autocompleteMachine = createMachine<DataContext, DataEvent>(
  machineJson,
  machineOptions
);
