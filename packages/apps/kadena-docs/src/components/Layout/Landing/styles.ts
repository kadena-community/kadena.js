import { styled, StyledComponent } from '@kadena/react-components';

export const Content: StyledComponent<'div', { name?: string }> = styled(
  'div',
  {
    display: 'flex',
    position: 'relative',
    gridColumn: '1 / span 1',
    gridRow: '3 / span 1',
    width: '100%',
    height: '100%',

    '@md': {
      gridColumn: '3 / span 3',
      gridRow: '3 / span 1',
    },
  },
);
