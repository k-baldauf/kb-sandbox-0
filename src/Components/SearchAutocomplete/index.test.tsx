import * as React from 'react';
import renderer from 'react-test-renderer';

import { AppThemeProvider } from '../../Common/Theme';
import { Location } from '../../utils/types';

import { SearchAutocomplete } from '.';

const locationGenerator: (index: number) => Location = (index) => ({
  text: `location text ${index}`,
  payload: {
    area: `${index} nearby`,
    geo: { lat: index, lon: index },
    location_type: 'place',
    term: 'something'
  },
  type: 'locations'
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

test('renders correctly with one location', () => {
  const tree = renderer
    .create(
      <Wrapper>
        <SearchAutocomplete
          locations={[locationGenerator(0)]}
          searchCoordinates={noop}
        />
      </Wrapper>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders correctly with several locations', () => {
  const tree = renderer
    .create(
      <Wrapper>
        <SearchAutocomplete
          locations={[4, 2, 1, 3, 5].map((n) => locationGenerator(n))}
          searchCoordinates={noop}
        />
      </Wrapper>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
