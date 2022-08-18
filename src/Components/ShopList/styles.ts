import styled from '@emotion/styled';
import { FontWeight, Spacing } from '@tablecheck/tablekit-theme';

import { pageTransitionEasing, slideRight } from '../../styles';

export const ShopListWrapper = styled('div')`
  animation: ${slideRight} ${pageTransitionEasing} 0.5s;
  display: grid;
  align-items: center;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
`;

export const FiltersContainer = styled('div')`
  margin: ${Spacing.L3} 0;
  gap: ${Spacing.L3};
`;

export const ShopName = styled('div')`
  font-weight: ${FontWeight.Bold};
  font-size: 1.5em;
  line-height: normal;
  margin: ${Spacing.L2} 0;
`;
