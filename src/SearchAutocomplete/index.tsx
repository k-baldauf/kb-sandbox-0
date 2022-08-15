import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { Button, Appearance } from '@tablecheck/tablekit-button';
import { Icon } from '@tablecheck/tablekit-icon';

import { Location } from 'utils/types';

import { AutocompleteWrapper } from './styles';

interface SearchAutocompleteProps {
  locations: Location[];
}

export function SearchAutocomplete({
  locations
}: SearchAutocompleteProps): JSX.Element {
  return (
    <>
      {locations.map((location) => (
        <AutocompleteWrapper
          key={`${location.payload.term}-${location.payload.area}`}
        >
          <Button
            appearance={Appearance.SubtleOutline}
            iconAfter={<Icon icon={faArrowRight} />}
            shouldFitContainer
          >
            {location.text}
            {location.payload.area ? ` (${location.payload.area})` : ''}
          </Button>
        </AutocompleteWrapper>
      ))}
    </>
  );
}
