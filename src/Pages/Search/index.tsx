import { Input } from '@tablecheck/tablekit-input';
import { useMachine } from '@xstate/react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { SearchAutocomplete } from 'Components/SearchAutocomplete';
import { ShopList } from 'Components/ShopList';
import { ShopPanel } from 'Components/ShopPanel';
import { autocompleteMachine } from 'Machines/Autocomplete/machine';
import { shopSearchMachine } from 'Machines/ShopSearch/machine';
import { shopSlideoutMachine } from 'Machines/ShopSlideout/machine';

import { SearchWrapper, ErrorMessage } from './styles';

export function Search(): JSX.Element {
  const { location = '' } = useParams();
  const [t, { language }] = useTranslation();
  const [search, setSearch] = React.useState(location);
  const [placeholder, setPlaceholder] = React.useState('');
  const [autocompleteState, autocompleteSend] = useMachine(autocompleteMachine);
  const [shopSearchState, shopSearchSend] = useMachine(shopSearchMachine);
  const [shopSlideoutState, shopSlideoutSend] = useMachine(shopSlideoutMachine);

  React.useEffect(() => {
    autocompleteSend('SEARCH', { language, search });
  }, [language, search, autocompleteSend]);

  const searchCoordinates = React.useCallback(
    (lat: number, lon: number, selectedItem: string) => {
      shopSearchSend('SEARCH', { language, lat, lon });
      autocompleteSend('CLEAR');
      setSearch('');
      setPlaceholder(selectedItem);
    },
    [autocompleteSend, shopSearchSend, setSearch, setPlaceholder, language]
  );

  const loadMoreShops = React.useCallback(
    () => shopSearchSend('MORE'),
    [shopSearchSend]
  );

  const selectShop = React.useCallback(
    (id: string) => {
      shopSlideoutSend('OPEN', { id, language });
    },
    [shopSlideoutSend, language]
  );

  return (
    <SearchWrapper>
      <Input
        label={t('main_page.search_label')}
        type="search"
        shouldFitContainer
        autoFocus
        onChange={(event) => setSearch(event.target.value)}
        placeholder={placeholder}
        value={search}
      />
      {(autocompleteState.value === 'searching' ||
        autocompleteState.value === 'results') && (
        <SearchAutocomplete
          locations={autocompleteState.context.results?.locations || []}
          searchCoordinates={searchCoordinates}
        />
      )}
      {autocompleteState.value === 'noResults' && (
        <>{t('main_page.no_locations_found')}</>
      )}
      {autocompleteState.value === 'error' && (
        <ErrorMessage>{t('main_page.search_error')}</ErrorMessage>
      )}
      {(shopSearchState.value === 'searching' ||
        shopSearchState.value === 'results') && (
        <ShopList
          shops={shopSearchState.context.results}
          selectShop={selectShop}
          moreAvailable={shopSearchState.context.moreAvailable}
          loadMoreShops={loadMoreShops}
        />
      )}
      <ShopPanel
        isError={shopSlideoutState.value === 'error'}
        isLoading={shopSlideoutState.value === 'opening'}
        isOpen={shopSlideoutState.value !== 'closed'}
        onClose={() => {
          shopSlideoutSend('CLOSE');
        }}
        shop={shopSlideoutState.context.shop}
      />
    </SearchWrapper>
  );
}
