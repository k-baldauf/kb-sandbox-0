import { faTimesCircle } from '@fortawesome/free-regular-svg-icons/faTimesCircle';

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
  return (
    <>
      {!!selectedFilters.length && (
        <FilterContainer>
          {label}
          {selectedFilters.map((filter) => (
            <FilterTag key={filter}>
              {filter}{' '}
              <ClickableIcon
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
