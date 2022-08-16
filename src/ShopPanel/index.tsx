import { Panel } from '@tablecheck/tablekit-panel';
import { useTranslation } from 'react-i18next';

import { Headline } from 'Layouts';
import { getBestTranslation } from 'utils';
import { PREVIEW_IMAGE_HEIGHT } from 'utils/constants';
import { ExtendedShop } from 'utils/types';

import {
  PanelWrapper,
  ShopTitle,
  ShopDescription,
  ShopAddress
} from './styles';

interface ShopPanelProps {
  isError: boolean;
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  shop: ExtendedShop | null;
}

export function ShopPanel({
  isError,
  isLoading,
  isOpen,
  onClose,
  shop
}: ShopPanelProps): JSX.Element {
  const [t, { language }] = useTranslation();

  return (
    <Panel isOpen={isOpen} onClickOutside={onClose} width="90%">
      <PanelWrapper>
        {!isError && !isLoading && shop && (
          <>
            {shop.search_image && (
              <div
                style={{
                  background: `url('${shop.search_image}') center`,
                  backgroundSize: `cover`,
                  height: PREVIEW_IMAGE_HEIGHT,
                  width: '100%'
                }}
              />
            )}
            <Headline>
              {getBestTranslation(shop.name_translations, language)
                ?.translation || ''}
            </Headline>
            <ShopTitle>
              {getBestTranslation(shop.content_title_translations, language)
                ?.translation || ''}
            </ShopTitle>
            <ShopDescription>
              {getBestTranslation(shop.content_body_translations, language)
                ?.translation || ''}
            </ShopDescription>
            <ShopAddress>
              <div>{t('main_page.address')}</div>
              <div>{shop.address.street}</div>
              <div>{shop.address.street2}</div>
              <div>{shop.address.city}</div>
              <div>{shop.address.region}</div>
              <div>{shop.address.country}</div>
              <div>{shop.address.postal_code}</div>
            </ShopAddress>
          </>
        )}
        {(isError || (!isLoading && !shop)) && <>Error</>}
        {isLoading && <>Loading</>}
      </PanelWrapper>
    </Panel>
  );
}
