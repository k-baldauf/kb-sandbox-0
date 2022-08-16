import { Input } from '@tablecheck/tablekit-input';
import { useMachine } from '@xstate/react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { shopMachine } from 'Machines/Shop/machine';
import { shopSearchMachine } from 'Machines/ShopSearch/machine';
import { SearchAutocomplete } from 'SearchAutocomplete';
import { ShopList } from 'ShopList';
import { ShopPanel } from 'ShopPanel';

import { autocompleteMachine } from '../../Machines/Autocomplete/machine';

import { SearchWrapper, ErrorMessage } from './styles';

export function Search(): JSX.Element {
  const [t, { language }] = useTranslation();
  const [search, setSearch] = React.useState('');
  const [autocompleteState, autocompleteSend] = useMachine(autocompleteMachine);
  const [shopSearchState, shopSearchSend] = useMachine(shopSearchMachine);
  const [shopState, shopSend] = useMachine(shopMachine);

  React.useEffect(() => {
    // Todo: Sanitize
    autocompleteSend('SEARCH', { language, search });
  }, [language, search, autocompleteSend]);

  const searchCoordinates = React.useCallback(
    (lat: number, lon: number) => {
      shopSearchSend('SEARCH', { language, lat, lon });
      autocompleteSend('CLEAR');
    },
    [autocompleteSend, shopSearchSend, language]
  );

  const selectShop = React.useCallback(
    (id: string) => {
      shopSend('OPEN', { id, language });
    },
    [shopSend, language]
  );

  return (
    <SearchWrapper>
      <Input
        label={t('main_page.search_label')}
        type="search"
        shouldFitContainer
        autoFocus
        onChange={(event) => setSearch(event.target.value)}
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
        />
      )}
      <ShopPanel
        isError={shopState.value === 'error'}
        isLoading={shopState.value === 'opening'}
        isOpen={shopState.value !== 'closed'}
        onClose={() => {
          shopSend('CLOSE');
        }}
        shop={shopState.context.shop}
      />
    </SearchWrapper>
  );
}
