import { styled, StyledComponent } from '@kadena/react-components';

export const Article: StyledComponent<'article'> = styled('article', {
  width: '100%',
  padding: '0 $2',
  backgroundColor: 'transparent',
});

export const Content: StyledComponent<'div', { layout?: 'landing' | 'home' }> =
  styled('div', {
    display: 'flex',
    position: 'relative',
    padding: '$10 0 $20',
    gridColumn: '1 / span 2',
    gridRow: '3 / span 1',
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    '@md': {
      gridColumn: '1 / span 3',
      gridRow: '3 / span 1',
    },
    defaultVariants: {
      layout: 'full',
    },
    variants: {
      layout: {
        home: {
          paddingTop: '0',
          '@md': {
            gridColumn: '2 / span 3',
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
