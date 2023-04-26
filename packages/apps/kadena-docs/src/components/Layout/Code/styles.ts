import { styled, StyledComponent } from '@kadena/react-components';

export const CodeBackground: StyledComponent<'div', { layout?: 'code' }> =
  styled('div', {
    position: 'absolute',
    zIndex: 2,
    pointerEvents: 'none',
    gridColumn: '1 / span 5',
    gridRow: '2 / span 2',
    display: 'block',
    transform: 'translateX(100%)',
    transition: 'transform .3s ease',
    '@md': {
      position: 'relative',
      display: 'block',
      transform: 'translateX(0)',
    },

    variants: {
      layout: {
        code: {},
      },
    },

    '&::before': {
      content: '',
      position: 'absolute',
      pointerEvents: 'none',
      inset: 0,
      backgroundImage: 'url("/assets/bg-code.png")',
      backgroundRepeat: 'no-repeat',
      backgroundPositionY: '-100px',
      backgroundPositionX: 'calc(100vw  - (200px + 120px))',
      '@2xl': {
        backgroundPositionX:
          'calc($sizes$pageWidth + ((100vw - $sizes$pageWidth) /2 ) - (300px +  120px))',
      },
    },
    '&::after': {
      content: '',
      position: 'absolute',
      inset: 0,
      left: 'calc(100vw  - (200px + 15px))',
      backgroundColor: '$backgroundOverlayColor',
      zIndex: 1,
      '@2xl': {
        left: 'calc($sizes$pageWidth + ((100vw - $sizes$pageWidth) /2) - 300px)',
      },
    },
  });

export const Article: StyledComponent<'article'> = styled('article', {
  width: '100%',
  padding: '0 $4',
  backgroundColor: 'transparent',
});

export const Aside: StyledComponent<'aside'> = styled('aside', {
  gridArea: 'aside',
  minWidth: '200px',
  width: '$sizes$asideWidth',
  overflow: 'hidden',

  zIndex: '$sideMenu',
  padding: '0 $4',
  position: 'absolute',
  transform: 'translateX(100%)',
  transition: 'transform .3s ease',
  '@md': {
    position: 'relative',
    transform: 'translateX(0)',
    gridColumn: '4 / span 2',
    gridRow: '2 / span 2',
  },
});

export const Content: StyledComponent<'div'> = styled('div', {
  display: 'flex',
  position: 'relative',
  gridColumn: '1 / span 2',
  gridRow: '3 / span 1',
  width: '100%',
  height: '100%',
  background: 'green',

  '@md': {
    gridColumn: '3 / span 1',
    gridRow: '3 / span 3',
  },
});
