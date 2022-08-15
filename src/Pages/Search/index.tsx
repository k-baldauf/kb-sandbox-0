import { Input } from '@tablecheck/tablekit-input';
import { useMachine } from '@xstate/react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { SearchAutocomplete } from 'SearchAutocomplete';

import { autocompleteMachine } from '../../Machines/Autocomplete/machine';

import { SearchWrapper } from './styles';

export function Search(): JSX.Element {
  const [t, { language }] = useTranslation();
  const [search, setSearch] = React.useState('');
  const [state, send] = useMachine(autocompleteMachine);

  React.useEffect(() => {
    // Todo: Sanitize
    send('SEARCH', { language, search });
  }, [language, search, send]);

  return (
    <SearchWrapper>
      <Input
        label={t('main_page.search_label')}
        type="search"
        shouldFitContainer
        autoFocus
        onChange={(event) => setSearch(event.target.value)}
      />
      <SearchAutocomplete locations={state.context.results?.locations || []} />
    </SearchWrapper>
  );
}
