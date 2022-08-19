import { faTimesCircle } from '@fortawesome/free-regular-svg-icons/faTimesCircle';
import { useTranslation } from 'react-i18next';

import { FilterContainer, FilterTag, ClickableIcon } from './styles';

interface SearchFilterProps {
  label: string;
  selectedFilters: string[];
  toggleFilter: (tag: string) => void;
}

export function SearchFilter({
  label,
  selectedFilters,
  toggleFilter
}: SearchFilterProps): JSX.Element {
  const [t] = useTranslation();

  return (
    <>
      {!!selectedFilters.length && (
        <FilterContainer>
          {label}
          {selectedFilters.map((filter) => (
            <FilterTag key={filter}>
              {filter}{' '}
              <ClickableIcon
                aria-label={`${t('search.actions.toggle_filter')} ${filter}`}
                icon={faTimesCircle}
                onClick={() => toggleFilter(filter)}
              />
            </FilterTag>
          ))}
        </FilterContainer>
      )}
    </>
  );
}
