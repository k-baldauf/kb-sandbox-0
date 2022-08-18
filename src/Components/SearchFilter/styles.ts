import styled from '@emotion/styled';
import { Icon } from '@tablecheck/tablekit-icon';
import { Spacing } from '@tablecheck/tablekit-theme';

export const FilterContainer = styled('div')`
  display: flex;
  flex-direction: row;
  gap: ${Spacing.L1};
`;

export const FilterTag = styled('div')`
  gap: ${Spacing.L1};
`;

export const ClickableIcon = styled(Icon)`
  &:hover {
    cursor: pointer;
  }
`;
