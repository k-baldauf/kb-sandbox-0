import { AutocompleteResponse } from '../../utils/types';

export enum EventType {
  AutocompleteSearch = 'done.invoke.autocomplete-search-service'
}

type ClearEvent = {
  type: 'CLEAR';
};

type SearchEvent = {
  type: 'SEARCH';
  language: string;
  search: string;
};

export type ResponsePayload = { response: AutocompleteResponse };
type ResponseEvent = {
  type: EventType.AutocompleteSearch;
  data: ResponsePayload;
};

export type DataEvent = ClearEvent | SearchEvent | ResponseEvent;

export type DataContext = {
  results: AutocompleteResponse | null;
};

export type DataArgs = [DataContext, DataEvent];
