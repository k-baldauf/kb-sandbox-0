import '@tablecheck/tablekit-free-icon-config';
import { TagSize } from '@tablecheck/tablekit-tag';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { getBestTranslation } from '../../utils';
import { PREVIEW_IMAGE_HEIGHT } from '../../utils/constants';
import { Shop } from '../../utils/types';

import {
  ShopItemWrapper,
  ShopName,
  ShopTag,
  TagContainer,
  TagSpacer
} from './styles';

interface ShopItemProps {
  shop: Shop;
  selectedCuisines: string[];
  selectedTags: string[];
  selectShop: (id: string) => void;
  toggleFilter: (tag: string, filter: string) => void;
}

export function ShopItem({
  shop,
  selectedCuisines,
  selectedTags,
  selectShop,
  toggleFilter
}: ShopItemProps): JSX.Element {
  const [, { language }] = useTranslation();
  const [canHover, setCanHover] = React.useState(true);

  const shopTagSharedProps = {
    size: TagSize.Small,
    onMouseOver: () => setCanHover(false),
    onMouseOut: () => setCanHover(true)
  };

  return (
    <ShopItemWrapper
      className={canHover ? '' : 'no-hover'}
      key={shop._id}
      onClick={() => selectShop(shop._id)}
    >
      {shop.search_image && (
        <div
          style={{
            background: `url('${shop.search_image}') center`,
            backgroundSize: `cover`,
            height: PREVIEW_IMAGE_HEIGHT
          }}
          aria-label={
            getBestTranslation(shop.name_translations, language)?.translation ||
            ''
          }
        />
      )}
      <ShopName>
        {getBestTranslation(shop.name_translations, language)?.translation ||
          ''}
      </ShopName>
      <TagContainer>
        {!!shop.cuisines.length && <TagSpacer />}
        {shop.cuisines.map((cuisine) => (
          <ShopTag
            key={cuisine}
            onClick={(event) => {
              event.stopPropagation();
              toggleFilter(cuisine, 'cuisines');
            }}
            isSelected={selectedCuisines.includes(cuisine)}
            {...shopTagSharedProps}
          >
            {cuisine}
          </ShopTag>
        ))}
        {!!shop.tags.length && <TagSpacer />}
        {shop.tags.map((tag) => (
          <ShopTag
            key={tag}
            onClick={(event) => {
              event.stopPropagation();
              toggleFilter(tag, 'tags');
            }}
            isSelected={selectedTags.includes(tag)}
            {...shopTagSharedProps}
          >
            {tag}
          </ShopTag>
        ))}
      </TagContainer>
    </ShopItemWrapper>
  );
}
