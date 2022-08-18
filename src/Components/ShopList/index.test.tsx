import * as React from 'react';
import { useTranslation } from 'react-i18next';
import renderer from 'react-test-renderer';

import { AppThemeProvider } from '../../Common/Theme';
import { Shop } from '../../utils/types';

import { ShopList } from '.';

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: jest.fn()
}));

afterEach(() => {
  (useTranslation as jest.Mock).mockClear();
});

const shopGenerator: (index: number, hasImage: boolean) => Shop = (
  index,
  hasImage
) => ({
  ...(hasImage ? { search_image: `${index}.jpg` } : {}),
  name_translations: [
    { locale: 'first', translation: `${index} name` },
    { locale: 'last', translation: `name ${index}` }
  ],
  name: [`boring name ${index}`],
  content_body_translations: [
    { locale: 'first', translation: `${index} body` },
    { locale: 'last', translation: `body ${index}` }
  ],
  content_title_translations: [
    { locale: 'first', translation: `${index} title` },
    { locale: 'last', translation: `title ${index}` }
  ],
  _id: `abc${index}`,
  cuisines: ['a', 'b'],
  tags: ['x', 'y'],
  geocode: { lon: 0, lat: 0 }
});

const noop = () => {
  /* No-op */
};

function Wrapper({ children }: { children: JSX.Element }): JSX.Element {
  return (
    <AppThemeProvider isDarkMode={false} setDarkMode={noop}>
      {children}
    </AppThemeProvider>
  );
}

test('renders correctly with one shop', () => {
  (useTranslation as jest.Mock).mockReturnValue([
    jest.fn(),
    { language: 'first' }
  ]);
  const tree = renderer
    .create(
      <Wrapper>
        <ShopList
          loadMoreShops={noop}
          moreAvailable={false}
          shops={[shopGenerator(0, false)]}
          selectShop={noop}
          selectedCuisines={[]}
          selectedTags={[]}
          toggleFilter={noop}
        />
      </Wrapper>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders correctly with more shops available', () => {
  (useTranslation as jest.Mock).mockReturnValue([
    jest.fn(),
    { language: 'second' }
  ]);
  const tree = renderer
    .create(
      <Wrapper>
        <ShopList
          loadMoreShops={noop}
          moreAvailable
          shops={[]}
          selectShop={noop}
          selectedCuisines={['b']}
          selectedTags={['x']}
          toggleFilter={noop}
        />
      </Wrapper>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders correctly with several shops', () => {
  (useTranslation as jest.Mock).mockReturnValue([
    jest.fn(),
    { language: 'invalid' }
  ]);
  const tree = renderer
    .create(
      <Wrapper>
        <ShopList
          loadMoreShops={noop}
          moreAvailable
          shops={[4, 2, 1, 3, 5].map((n) => shopGenerator(n, !!(n % 2)))}
          selectShop={noop}
          selectedCuisines={['a']}
          selectedTags={['z']}
          toggleFilter={noop}
        />
      </Wrapper>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
