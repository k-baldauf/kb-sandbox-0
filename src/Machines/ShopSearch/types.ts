import { Shop } from 'utils/types';

export const EventTypes = {
  SHOP_SEARCH: 'done.invoke.shop-search-service' as const
};

type SearchEvent = {
  type: 'SEARCH';
  language: string;
  lat: number;
  lon: number;
};

export type ResponsePayload = { response: Shop[] };
type ResponseEvent = {
  type: typeof EventTypes.SHOP_SEARCH;
  data: ResponsePayload;
};

export type DataEvent = SearchEvent | ResponseEvent;

export type DataContext = {
  results: Shop[];
};

export type DataArgs = [DataContext, DataEvent];
