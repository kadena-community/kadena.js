import { IconButton, styled, StyledComponent } from '@kadena/react-components';

export const HeaderIconGroup: StyledComponent<'div'> = styled('div', {
  display: 'flex',
  gap: '$1',
  marginLeft: '$6',
});

export const HideOnMobile: StyledComponent<'div'> = styled('div', {
  display: 'none',
  '@md': {
    display: 'flex',
  },
});
