import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { Appearance, Button } from '@tablecheck/tablekit-button';
import { Icon } from '@tablecheck/tablekit-icon';
import { Panel } from '@tablecheck/tablekit-panel';
import { useTranslation } from 'react-i18next';

import { Headline } from '../../Layouts';
import { getBestTranslation } from '../../utils';
import { PREVIEW_IMAGE_HEIGHT } from '../../utils/constants';
import { ExtendedShop } from '../../utils/types';

import {
  PanelWrapper,
  ShopTitle,
  ShopDescription,
  ShopAddress,
  ScrollableContent,
  FixedContent
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
    <Panel
      isOpen={isOpen}
      onClickOutside={onClose}
      width="90%"
      shouldDisableBodyScroll
    >
      <PanelWrapper>
        {!isError && !isLoading && shop && (
          <>
            <FixedContent>
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
            </FixedContent>
            <ScrollableContent>
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
            </ScrollableContent>
          </>
        )}
        {(isError || (!isLoading && !shop)) && (
          <ScrollableContent>{t('main_page.location_error')}</ScrollableContent>
        )}
        {isLoading && (
          <ScrollableContent>{t('main_page.loading')}</ScrollableContent>
        )}
        <FixedContent>
          <Button
            appearance={Appearance.SubtleOutline}
            iconBefore={<Icon icon={faArrowLeft} />}
            onClick={onClose}
            shouldFitContainer
          >
            {t('main_page.location_close')}
          </Button>
        </FixedContent>
      </PanelWrapper>
    </Panel>
  );
}
