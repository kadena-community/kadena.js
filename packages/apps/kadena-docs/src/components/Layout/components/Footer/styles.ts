import { darkTheme, styled, StyledComponent } from '@kadena/react-components';

export const StyledFooter: StyledComponent<'footer'> = styled('footer', {
  position: 'relative',
  gridArea: 'footer',
  zIndex: '$menu',
  background: '$neutral2',

  [`.${darkTheme} &`]: {
    background: '$neutral3',
  },
});

export const Box: StyledComponent<'div'> = styled('div', {
  display: 'flex',
});
