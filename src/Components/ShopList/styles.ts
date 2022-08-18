import styled from '@emotion/styled';
import {
  BORDER_RADIUS,
  COLORS,
  FontWeight,
  Spacing
} from '@tablecheck/tablekit-theme';

import { pageTransitionEasing, slideRight } from '../../styles';

export const ShopListWrapper = styled('div')`
  animation: ${slideRight} ${pageTransitionEasing} 0.5s;
  display: grid;
  align-items: center;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
`;

export const ShopItem = styled('button')`
  margin: ${Spacing.L1};
  color: inherit;
  &:hover {
    cursor: pointer;
  }
  border: ${COLORS.PURPLE.L5} 1px solid;
  border-radius: ${BORDER_RADIUS};
  padding: ${Spacing.L3};
`;

export const ShopName = styled('div')`
  font-weight: ${FontWeight.SemiBold};
`;
