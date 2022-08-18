import { Shop } from '../../utils/types';

export enum EventType {
  ShopSearch = 'done.invoke.shop-search-service'
}

type GenericEvent = {
  type: 'MORE';
};

type ChangeFilterEvent = {
  type: 'CHANGEFILTER';
  tag: string;
  filter: 'tags' | 'cuisines';
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

export type DataEvent =
  | GenericEvent
  | ChangeFilterEvent
  | SearchEvent
  | ResponseEvent;

export type DataContext = {
  language?: string;
  lat?: number;
  lon?: number;
  moreAvailable: boolean;
  page: number;
  results: Shop[];
  tags: string[];
  cuisines: string[];
};

export type DataArgs = [DataContext, DataEvent];
