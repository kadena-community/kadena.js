import { styled } from '../../styles';

import { type StyledComponent } from '@stitches/react/types/styled-component';

export const Divider: StyledComponent<'hr'> = styled('hr', {
  borderColor: '$borderColor',
  borderWidth: '1px',
  borderBottomWidth: '0',
  margin: '$10 0',
});
