import { Shop } from '../../utils/types';

export enum EventType {
  ShopSearch = 'done.invoke.shop-search-service'
}

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
  type: EventType.ShopSearch;
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
