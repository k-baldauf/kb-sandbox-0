import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown';
import { Appearance, Button } from '@tablecheck/tablekit-button';
import { Icon } from '@tablecheck/tablekit-icon';
import { useTranslation } from 'react-i18next';

import { getBestTranslation } from '../../utils';
import { PREVIEW_IMAGE_HEIGHT } from '../../utils/constants';
import { Shop } from '../../utils/types';

import {
  ShopListWrapper,
  ShopItem,
  ShopName,
  ShopTag,
  TagContainer
} from './styles';

interface ShopListProps {
  loadMoreShops: () => void;
  moreAvailable: boolean;
  shops: Shop[];
  selectShop: (id: string) => void;
}

export function ShopList({
  loadMoreShops,
  moreAvailable,
  shops,
  selectShop
}: ShopListProps): JSX.Element {
  const [t, { language }] = useTranslation();

  return (
    <ShopListWrapper>
      {shops.map((shop) => (
        <ShopItem key={shop._id} onClick={() => selectShop(shop._id)}>
          {shop.search_image && (
            <div
              style={{
                background: `url('${shop.search_image}') center`,
                backgroundSize: `cover`,
                height: PREVIEW_IMAGE_HEIGHT
              }}
            />
          )}
          <ShopName>
            {getBestTranslation(shop.name_translations, language)
              ?.translation || ''}
          </ShopName>
          <TagContainer>
            {shop.tags.map((tag) => (
              <ShopTag key={tag}>{tag}</ShopTag>
            ))}
          </TagContainer>
        </ShopItem>
      ))}
      {moreAvailable && (
        <Button
          onClick={loadMoreShops}
          appearance={Appearance.SubtleOutline}
          iconAfter={<Icon icon={faArrowDown} />}
          shouldFitContainer
        >
          <ShopName>{t('main_page.load_more_shops')}</ShopName>
        </Button>
      )}
    </ShopListWrapper>
  );
}
