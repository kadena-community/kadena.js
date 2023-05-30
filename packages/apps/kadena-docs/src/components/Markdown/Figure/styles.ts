import { styled, StyledComponent } from '@kadena/react-components';

export const StyledFigure: StyledComponent<'figure'> = styled('figure', {
  width: '100%',
  position: 'relative',
  '& figcaption': {
    textAlign: 'center',
  },
});
