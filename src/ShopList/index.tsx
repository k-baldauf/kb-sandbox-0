import { useTranslation } from 'react-i18next';

import { getBestTranslation } from 'utils';
import { PREVIEW_IMAGE_HEIGHT } from 'utils/constants';
import { Shop } from 'utils/types';

import { ShopListWrapper, ShopItem, ShopName } from './styles';

interface ShopListProps {
  shops: Shop[];
  selectShop: (id: string) => void;
}

export function ShopList({ shops, selectShop }: ShopListProps): JSX.Element {
  const [, { language }] = useTranslation();

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
        </ShopItem>
      ))}
    </ShopListWrapper>
  );
}
