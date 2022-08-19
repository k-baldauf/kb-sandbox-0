import { useTheme } from '@emotion/react';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { Appearance, Button } from '@tablecheck/tablekit-button';
import { Icon } from '@tablecheck/tablekit-icon';
import { Panel } from '@tablecheck/tablekit-panel';
import { Link } from '@tablecheck/tablekit-typography';
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
  fromLocation: [lat: number | undefined, lon: number | undefined];
  isError: boolean;
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  shop: ExtendedShop | null;
}

export function ShopPanel({
  fromLocation,
  isError,
  isLoading,
  isOpen,
  onClose,
  shop
}: ShopPanelProps): JSX.Element {
  const [t, { language }] = useTranslation();
  const { isDark } = useTheme();

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&${
    typeof fromLocation[0] === 'number' && typeof fromLocation[1] === 'number'
      ? `origin=${fromLocation.join(',')}&`
      : ''
  }destination=${shop?.geocode.lat},${shop?.geocode.lon}`;

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
                  aria-label={
                    getBestTranslation(shop.name_translations, language)
                      ?.translation || ''
                  }
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
              <ShopAddress className={isDark ? 'dark-theme' : ''}>
                <div>{t('search.labels.address')}</div>
                <div>{shop.address.street}</div>
                <div>{shop.address.street2}</div>
                <div>{shop.address.city}</div>
                <div>{shop.address.region}</div>
                <div>{shop.address.country}</div>
                <div>{shop.address.postal_code}</div>
                <Link href={googleMapsUrl}>
                  {t('search.actions.get_directions')}
                </Link>
              </ShopAddress>
            </ScrollableContent>
          </>
        )}
        {(isError || (!isLoading && !shop)) && (
          <ScrollableContent>
            {t('search.results.location_error')}
          </ScrollableContent>
        )}
        {isLoading && (
          <ScrollableContent>{t('actions.loading')}</ScrollableContent>
        )}
        <FixedContent className="fixed-ltr">
          <Button
            appearance={Appearance.SubtleOutline}
            iconBefore={<Icon icon={faArrowLeft} />}
            onClick={onClose}
            shouldFitContainer
          >
            {t('search.results.location_close')}
          </Button>
        </FixedContent>
      </PanelWrapper>
    </Panel>
  );
}
