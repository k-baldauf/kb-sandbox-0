import { createMachine, assign } from 'xstate';

import { getData } from 'utils/api';
import { SHOP_UNIVERSE_ID } from 'utils/constants';
import { eventError, extractArgs } from 'utils/machines';
import { ExtendedShop } from 'utils/types';

import {
  EventTypes,
  DataContext,
  DataEvent,
  ResponsePayload,
  DataArgs
} from './types';

const machineJson = {
  id: 'shop',
  predictableActionArguments: true,
  context: {
    shop: null
  },
  initial: 'closed',
  states: {
    closed: {},
    opening: {
      invoke: {
        src: 'shopGet',
        id: 'shop-get-service',
        onDone: [
          { cond: 'hasOneShop', target: 'open', actions: 'setShop' },
          { target: 'error', actions: 'clearShop' }
        ],
        onError: { target: 'error' }
      }
    },
    open: {},
    error: {}
  },
  on: {
    OPEN: [
      { cond: 'searchMatchesContext', target: 'open' },
      { cond: 'hasSearchParams', target: 'opening' },
      { target: 'closed' }
    ],
    CLOSE: { target: 'closed' }
  }
};

const machineActions = {
  clearShop: assign((...args: DataArgs) => {
    extractArgs(args);
    return { shop: null };
  }),
  setShop: assign((...args: DataArgs) => {
    const { event } = extractArgs(args);
    if (event.type !== EventTypes.SHOP_GET)
      throw new Error(eventError(event, EventTypes.SHOP_GET));
    return {
      shop: event.data.response[0]
    };
  })
};

const machineGuards = {
  hasOneShop: (...args: DataArgs) => {
    const { event } = extractArgs(args);
    if (event.type !== EventTypes.SHOP_GET)
      throw new Error(eventError(event, EventTypes.SHOP_GET));
    return event.data.response.length === 1;
  },
  hasSearchParams: (...args: DataArgs) => {
    const { event } = extractArgs(args);
    if (event.type !== 'OPEN') throw new Error(eventError(event, 'OPEN'));
    return !!event.language && !!event.id;
  },
  searchMatchesContext: (...args: DataArgs) => {
    const { context, event } = extractArgs(args);
    if (event.type !== 'OPEN') throw new Error(eventError(event, 'OPEN'));
    return !!context.shop && context.shop._id === event.id;
  }
};

const machineServices = {
  shopGet: async (...args: DataArgs): Promise<ResponsePayload> => {
    const { event } = extractArgs(args);
    if (event.type !== 'OPEN') throw new Error(eventError(event, 'OPEN'));
    const { language, id } = event;
    const response = await getData<{ shops: ExtendedShop[] }>(
      `shop_search?id=${id}&shop_universe_id=${SHOP_UNIVERSE_ID}&locale=${language}`
    );
    return { response: response.shops };
  }
};

const machineOptions = {
  actions: machineActions,
  guards: machineGuards,
  services: machineServices
};

export const shopMachine = createMachine<DataContext, DataEvent>(
  machineJson,
  machineOptions
);
