import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { Button, Appearance } from '@tablecheck/tablekit-button';
import { Icon } from '@tablecheck/tablekit-icon';

import { Location } from 'utils/types';

import { AutocompleteWrapper } from './styles';

interface SearchAutocompleteProps {
  locations: Location[];
  searchCoordinates: (lat: number, lon: number) => void;
}

export function SearchAutocomplete({
  locations,
  searchCoordinates
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
            onClick={() =>
              searchCoordinates(
                location.payload.geo.lat,
                location.payload.geo.lon
              )
            }
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
