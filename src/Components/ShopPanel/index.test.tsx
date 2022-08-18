import * as React from 'react';
import { useTranslation } from 'react-i18next';
import renderer from 'react-test-renderer';

import { AppThemeProvider } from '../../Common/Theme';
import { ExtendedShop } from '../../utils/types';

import { ShopPanel } from '.';

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: jest.fn()
}));

beforeEach(() => {
  (useTranslation as jest.Mock).mockReturnValue([
    jest.fn((x) => x),
    { language: 'first' }
  ]);
});
afterEach(() => {
  (useTranslation as jest.Mock).mockClear();
});

const shopGenerator: (index: number, hasImage: boolean) => ExtendedShop = (
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
  address: {
    country: `${index} country`,
    city: `city ${index}`,
    street: `${index} street`,
    street2: '',
    region: `region ${index}`,
    postal_code: `${index}${index}${index}`
  },
  cuisines: [],
  tags: [],
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

test('renders correctly when open with no image', () => {
  const tree = renderer
    .create(
      <Wrapper>
        <ShopPanel
          fromLocation={[0, 0]}
          isError={false}
          isLoading={false}
          isOpen
          onClose={noop}
          shop={shopGenerator(0, false)}
        />
      </Wrapper>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders correctly when open with an image', () => {
  const tree = renderer
    .create(
      <Wrapper>
        <ShopPanel
          fromLocation={[0, 0]}
          isError={false}
          isLoading={false}
          isOpen
          onClose={noop}
          shop={shopGenerator(0, true)}
        />
      </Wrapper>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders correctly when loading', () => {
  const tree = renderer
    .create(
      <Wrapper>
        <ShopPanel
          fromLocation={[0, 0]}
          isError={false}
          isLoading
          isOpen
          onClose={noop}
          shop={null}
        />
      </Wrapper>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders the error when erroring', () => {
  const tree = renderer
    .create(
      <Wrapper>
        <ShopPanel
          fromLocation={[0, 0]}
          isError
          isLoading={false}
          isOpen
          onClose={noop}
          shop={shopGenerator(0, false)}
        />
      </Wrapper>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders the error when there should be a shop but is not', () => {
  const tree = renderer
    .create(
      <Wrapper>
        <ShopPanel
          fromLocation={[0, 0]}
          isError={false}
          isLoading={false}
          isOpen
          onClose={noop}
          shop={null}
        />
      </Wrapper>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders correctly when closed', () => {
  const tree = renderer
    .create(
      <Wrapper>
        <ShopPanel
          fromLocation={[0, 0]}
          isError={false}
          isLoading={false}
          isOpen={false}
          onClose={noop}
          shop={shopGenerator(0, false)}
        />
      </Wrapper>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
