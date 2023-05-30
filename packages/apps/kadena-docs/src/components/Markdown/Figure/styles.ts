import { styled, StyledComponent } from '@kadena/react-components';

export const StyledFigure: StyledComponent<'figure'> = styled('figure', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  position: 'relative',

  '& figcaption': {
    textAlign: 'center',
  },
});
