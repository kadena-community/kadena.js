import { styled, StyledComponent } from '@kadena/react-components';

export const StyledFigure: StyledComponent<'figure'> = styled('figure', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '$5 0',
  width: '100%',
  position: 'relative',

  '& img': {
    height: '100%',
  },
  '& figcaption': {
    textAlign: 'center',
  },
});
