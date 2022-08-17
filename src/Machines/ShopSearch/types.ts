import { Shop } from '../../utils/types';

export const EventTypes = {
  SHOP_SEARCH: 'done.invoke.shop-search-service' as const
};

type GenericEvent = {
  type: 'MORE';
};

type SearchEvent = {
  type: 'SEARCH';
  language: string;
  lat: number;
  lon: number;
};

export type ResponsePayload = {
  response: Shop[];
  page: number;
  moreAvailable: boolean;
};
type ResponseEvent = {
  type: typeof EventTypes.SHOP_SEARCH;
  data: ResponsePayload;
};

export type DataEvent = GenericEvent | SearchEvent | ResponseEvent;

export type DataContext = {
  language?: string;
  lat?: number;
  lon?: number;
  moreAvailable: boolean;
  page: number;
  results: Shop[];
};

export type DataArgs = [DataContext, DataEvent];
