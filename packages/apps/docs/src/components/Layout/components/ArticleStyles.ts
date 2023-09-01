import { type StyledComponent, styled } from '@kadena/react-components';

export const Article: StyledComponent<'article'> = styled('article', {
  width: '100%',
  padding: '0 $10',
  backgroundColor: 'transparent',
});

export const Content: StyledComponent<
  'div',
  { layout?: 'landing' | 'home' | 'code' }
> = styled('div', {
  display: 'flex',
  position: 'relative',
  padding: '$10 0 $35',
  gridColumn: '1 / span 2',
  gridRow: '3 / span 1',
  overflow: 'hidden',
  width: '100%',
  height: '100%',
  '@md': {
    gridColumn: '3 / span 1',
    gridRow: '3 / span 1',
  },
  defaultVariants: {
    layout: 'full',
  },
  variants: {
    layout: {
      home: {
        '@md': {
          gridColumn: '2 / span 3',
        },
      },
      code: {
        '@md': {
          gridColumn: '3 / span 1',
        },
      },
      landing: {
        gridColumn: '1 / span 1',

        '@md': {
          gridColumn: '3 / span 1',
        },
      },
    },
  },
});
