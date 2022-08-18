import styled from '@emotion/styled';
import { Spacing } from '@tablecheck/tablekit-theme';

export const PanelWrapper = styled('div')`
  padding: ${Spacing.L3};
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const FixedContent = styled('div')`
  flex-shrink: 0;
  flex-grow: 0;
  &.fixed-ltr {
    direction: ltr;
  }
`;

export const ScrollableContent = styled('div')`
  flex-shrink: 1;
  flex-grow: 1;
  overflow-y: scroll;
`;

export const ShopTitle = styled('h2')`
  margin: ${Spacing.L2} 0;
`;

export const ShopDescription = styled('div')``;

export const ShopAddress = styled('div')`
  margin: ${Spacing.L2} 0;
  border: black 1px solid;
  &.dark-theme {
    border: white 1px solid;
  }
  padding: ${Spacing.L2};
  width: fit-content;
`;
