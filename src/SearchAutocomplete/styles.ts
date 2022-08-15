import styled from '@emotion/styled';

import { pageTransitionEasing, slideRight } from 'styles';

export const AutocompleteWrapper = styled('div')`
  animation: ${slideRight} ${pageTransitionEasing} 0.5s;
`;
