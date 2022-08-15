import { Input } from '@tablecheck/tablekit-input';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { SearchAutocomplete } from 'SearchAutocomplete';
import { SHOP_UNIVERSE_ID } from 'utils/constants';
import { AutocompleteResponse, Location } from 'utils/types';

import { SearchWrapper } from './styles';

export function Search(): JSX.Element {
  const [t, { language }] = useTranslation();
  const [search, setSearch] = React.useState('');
  const [locationResults, setLocationResults] = React.useState<Location[]>([]);

  React.useEffect(() => {
    // TODO: Santize, extract base URL
    if (search) {
      fetch(
        `https://staging-snap.tablecheck.com/v2/autocomplete?locale=${language}&shop_universe_id=${SHOP_UNIVERSE_ID}&text=${search}`
      )
        .then((response) => response.json())
        .then((data: AutocompleteResponse) =>
          setLocationResults(data.locations || [])
        );
    } else {
      setLocationResults([]);
    }
  }, [search, setLocationResults]);

  return (
    <SearchWrapper>
      <Input
        label={t('main_page.search_label')}
        type="search"
        shouldFitContainer
        autoFocus
        onChange={(event) => setSearch(event.target.value)}
      />
      <SearchAutocomplete locations={locationResults} />
    </SearchWrapper>
  );
}
