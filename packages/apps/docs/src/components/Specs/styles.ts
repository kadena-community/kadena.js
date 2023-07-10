import { styled, StyledComponent } from '@kadena/react-components';

export const Wrapper: StyledComponent<'div'> = styled('div', {
  gridColumn: '1 / span 2',
  '@md': {
    gridColumn: '1 / span 5',
  },

  '& .api-content': {
    width: '100vw',

    'h1, h2, h3, h4, h5, h6': {
      lineHeight: '100%',
    },
  },

  '& img[alt="logo"]': {
    display: 'none',
  },
});
