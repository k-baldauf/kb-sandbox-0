export type Translation = {
  translation: string;
  locale: string;
};

export type AutocompleteResponse = {
  locations?: Location[];
};

export type Location = {
  payload: {
    area: string | null;
    geo: {
      lat: number;
      lon: number;
    };
    location_type: string;
    term: string;
  };
  text: string;
  type: 'locations';
};

type Address = {
  country: string;
  city: string;
  street: string;
  street2: string;
  region: string;
  postal_code: string;
};

export type Shop = {
  search_image?: string;
  name_translations: Translation[];
  name: string[];
  content_body_translations: Translation[];
  content_title_translations: Translation[];
  tags: string[];
  _id: string;
};

export type ExtendedShop = Shop & {
  address: Address;
};
