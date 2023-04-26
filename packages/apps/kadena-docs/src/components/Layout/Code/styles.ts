import { styled, StyledComponent } from '@kadena/react-components';

export const CodeBackground: StyledComponent<
  'div',
  {
    layout?: 'code' | 'default';
    isOpen?: boolean | 'true' | 'false' | undefined;
  }
> = styled('div', {
  position: 'absolute',
  zIndex: 2,
  pointerEvents: 'none',
  width: '100vw',
  height: '100vh',

  transform: 'translateX(100vw)',

  '@md': {
    position: 'absolute',
    transform: 'translateX(0)',
  },

  defaultVariants: {
    layout: 'default',
  },
  compoundVariants: [
    {
      isOpen: true,
      layout: 'code',
      css: {
        '&::before': {
          '@md': {
            '@md': {
              backgroundPositionX: 'calc(100vw  - (200px + 80px))',
            },
          },
        },
        '&::after': {
          '@md': {
            '@md': {
              left: 'calc(100vw  - (200px + 15px))',
            },
          },
        },
      },
    },
  ],
  variants: {
    isOpen: {
      true: {
        transform: 'translateX(0)',
      },
      false: {},
    },
    layout: {
      default: {
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
      },
      code: {
        '&::before': {
          content: '',
          position: 'absolute',
          pointerEvents: 'none',
          inset: 0,
          backgroundImage: 'url("/assets/bg-vertical.png")',
          backgroundRepeat: 'no-repeat',
          backgroundPositionY: '-100px',

          '@2xl': {
            backgroundPositionX:
              'calc($sizes$pageWidth + ((100vw - $sizes$pageWidth) /2 ) - (300px +  80px))',
          },
        },
      },
    },
  },

  '&::after': {
    content: '',
    position: 'absolute',
    inset: 0,
    backgroundColor: '$backgroundOverlayColor',
    zIndex: 1,
    '@md': {
      left: 'calc(100vw  - (200px + 15px))',
    },
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

export const Aside: StyledComponent<
  'aside',
  {
    layout?: 'code' | 'default';
    isOpen?: boolean | 'true' | 'false' | undefined;
  }
> = styled('aside', {
  gridArea: 'aside',
  minWidth: '200px',
  width: '$sizes$asideWidth',
  overflow: 'hidden',

  gridColumn: '4 / span 2',
  gridRow: '2 / span 2',

  zIndex: '$sideMenu',
  padding: '0 $4',
  position: 'absolute',
  transform: 'translateX(100vw)',

  '@md': {
    transform: 'translateX(0)',
  },
  compoundVariants: [
    {
      isOpen: true,
      layout: 'code',
      css: {
        transform: 'translateX(0)',
      },
    },
  ],
  variants: {
    layout: {
      code: {},
      default: {},
    },
    isOpen: {
      true: {},
      false: {},
    },
  },
});

export const Content: StyledComponent<'div'> = styled('div', {
  display: 'flex',
  position: 'relative',
  gridColumn: '1 / span 2',
  gridRow: '3 / span 1',
  width: '100%',
  height: '100%',

  '@md': {
    gridColumn: '3 / span 1',
    gridRow: '3 / span 3',
  },
});
