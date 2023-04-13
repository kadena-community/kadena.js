import { styled, StyledComponent } from '@kadena/react-components';

export const Aside: StyledComponent<'aside'> = styled('aside', {
  display: 'none',
  width: '25%',
  overflow: 'hidden',
  '@md': {
    display: 'block',
  },
});
