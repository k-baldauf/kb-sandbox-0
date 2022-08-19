import '@tablecheck/tablekit-free-icon-config';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown';
import { Appearance, Button } from '@tablecheck/tablekit-button';
import { Icon } from '@tablecheck/tablekit-icon';
import { useTranslation } from 'react-i18next';

import { SearchFilter } from 'Components/SearchFilter';
import { ShopItem } from 'Components/ShopItem';

import { Shop } from '../../utils/types';

import { ShopListWrapper, ShopName, FiltersContainer } from './styles';

interface ShopListProps {
  loadMoreShops: () => void;
  moreAvailable: boolean;
  shops: Shop[];
  selectedCuisines: string[];
  selectedTags: string[];
  selectShop: (id: string) => void;
  toggleFilter: (tag: string, filter: string) => void;
}

export function ShopList({
  loadMoreShops,
  moreAvailable,
  shops,
  selectedCuisines,
  selectedTags,
  selectShop,
  toggleFilter
}: ShopListProps): JSX.Element {
  const [t] = useTranslation();

  return (
    <>
      {(!!selectedCuisines.length || !!selectedTags.length) && (
        <FiltersContainer>
          <SearchFilter
            label={t('search.labels.cuisines_label')}
            selectedFilters={selectedCuisines}
            toggleFilter={(cuisine) => toggleFilter(cuisine, 'cuisines')}
          />
          <SearchFilter
            label={t('search.labels.tags_label')}
            selectedFilters={selectedTags}
            toggleFilter={(tag) => toggleFilter(tag, 'tags')}
          />
        </FiltersContainer>
      )}
      <ShopListWrapper>
        {shops.map((shop) => (
          <ShopItem
            key={shop._id}
            shop={shop}
            selectedCuisines={selectedCuisines}
            selectedTags={selectedTags}
            selectShop={selectShop}
            toggleFilter={toggleFilter}
          />
        ))}
        {moreAvailable && (
          <Button
            onClick={loadMoreShops}
            appearance={Appearance.SubtleOutline}
            iconAfter={<Icon icon={faArrowDown} />}
            shouldFitContainer
          >
            <ShopName>{t('search.actions.load_more_shops')}</ShopName>
          </Button>
        )}
      </ShopListWrapper>
    </>
  );
}
