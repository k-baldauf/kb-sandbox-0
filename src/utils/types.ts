export type AutocompleteResponse = {
  locations?: Location[];
};

export type Location = {
  payload: {
    area: string | null;
    geo: {
      lat: number;
      long: number;
    };
    location_type: string;
    term: string;
  };
  text: string;
  type: 'locations';
};
