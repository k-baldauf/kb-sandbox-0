import styled from '@emotion/styled';
import { Tag } from '@tablecheck/tablekit-tag';
import {
  BORDER_RADIUS,
  COLORS,
  FontWeight,
  Spacing
} from '@tablecheck/tablekit-theme';

export const ShopItemWrapper = styled('button')`
  margin: ${Spacing.L1};
  color: inherit;
  &:hover:not(.no-hover) {
    cursor: pointer;
    background-color: ${COLORS.PURPLE.L5}30;
  }
  border: ${COLORS.PURPLE.L5} 1px solid;
  border-radius: ${BORDER_RADIUS};
  padding: ${Spacing.L3};
  height: calc(100% - 2 * ${Spacing.L1});
`;

export const ShopName = styled('div')`
  font-weight: ${FontWeight.Bold};
  font-size: 1.5em;
  line-height: normal;
  margin: ${Spacing.L2} 0;
`;

export const TagContainer = styled('div')`
  height: 100%;
`;

export const TagSpacer = styled('div')`
  border-top: ${COLORS.PURPLE.L5} 1px solid;
  margin: ${Spacing.L1} ${Spacing.L4};
`;

export const ShopTag = styled(Tag)`
  margin: ${Spacing.L1};
`;
