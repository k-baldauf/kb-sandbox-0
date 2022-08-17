import { AutocompleteResponse } from '../../utils/types';

export const EventTypes = {
  AUTOCOMPLETE_SEARCH: 'done.invoke.autocomplete-search-service' as const
};

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
  type: typeof EventTypes.AUTOCOMPLETE_SEARCH;
  data: ResponsePayload;
};

export type DataEvent = ClearEvent | SearchEvent | ResponseEvent;

export type DataContext = {
  results: AutocompleteResponse | null;
};

export type DataArgs = [DataContext, DataEvent];
