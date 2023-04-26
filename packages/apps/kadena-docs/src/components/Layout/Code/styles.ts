import { styled, StyledComponent } from '@kadena/react-components';

import { LayoutType } from '@/types/Layout';

export const CodeBackground: StyledComponent<'div'> = styled('div', {
  gridColumn: '1 / span 5',
  gridRow: '2 / span 2',
  backgroundImage: 'url("/assets/bg-code.png")',
  backgroundRepeat: 'no-repeat',
  backgroundPositionY: '-100px',
  backgroundPositionX: 'calc(100vw  - 400px)',
  display: 'none',
  '@md': {
    display: 'block',
  },
  '@2xl': {
    backgroundPositionX:
      'calc($sizes$pageWidth + ((100vw - $sizes$pageWidth) /2) - 400px)',
  },
});

export const CodeBackgroundOverlay: StyledComponent<'div'> = styled('div', {
  gridColumn: '4 / span 2',
  gridRow: '2 / span 2',
  backgroundColor: '$backgroundOverlayColor',
  width: '100%',
  display: 'none',
  '@md': {
    display: 'block',
  },
});

export const Article: StyledComponent<'article'> = styled('article', {
  width: '100%',
  padding: '0 $4',
  backgroundColor: 'transparent',
});

export const Aside: StyledComponent<'aside'> = styled('aside', {
  gridArea: 'aside',
  display: 'none',
  minWidth: '200px',
  width: '300px',
  overflow: 'hidden',
  gridColumn: '1 / span 1',
  gridRow: '2 / span 2',
  background: 'transparent',
  '@md': {
    display: 'block',
    gridColumn: '4 / span 2',
    gridRow: '2 / span 2',
  },
});

export const Content: StyledComponent<'div', { layoutType?: LayoutType }> =
  styled('div', {
    display: 'flex',
    position: 'relative',
    gridColumn: '1 / span 1',
    gridRow: '3 / span 1',
    width: '100%',
    height: '100%',

    '@md': {
      gridColumn: '3 / span 1',
      gridRow: '3 / span 3',
    },

    variants: {
      layoutType: {
        code: {},
      },
    },
  });
