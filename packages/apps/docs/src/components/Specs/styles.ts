import { styled, StyledComponent } from '@kadena/react-components';

export const Wrapper: StyledComponent<'div'> = styled('div', {
  '& .menu-content': {
    '& li': {
      '& span': {
        color: '$foreground',
      },

      '& polygon': {
        fill: '$foreground',
      },
    },
  },
  '& .api-content': {
    width: '100%',
    color: '$foreground',

    '& polygon': {
      fill: '$foreground',
    },

    'h1, h2, h3, h4, h5, h6': {
      lineHeight: '100%',
      color: '$foreground',
    },
  },

  '& img[alt="logo"]': {
    display: 'none',
  },
});
