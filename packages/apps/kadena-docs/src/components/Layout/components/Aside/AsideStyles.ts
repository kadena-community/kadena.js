import { styled, StyledComponent } from '@kadena/react-components';

export const BaseBackground: StyledComponent<
  'div',
  {
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

  variants: {
    isOpen: {
      true: {},
      false: {},
    },
  },

  '&::after': {
    content: '',
    position: 'absolute',
    inset: 0,
    backgroundColor: '$backgroundOverlayColor',
    zIndex: 1,
  },
});

export const CodeBackground: StyledComponent<typeof BaseBackground> = styled(
  BaseBackground,
  {
    $$shadowWidth: '$sizes$20',
    '&::before': {
      content: '',
      position: 'absolute',
      pointerEvents: 'none',
      inset: 0,
      backgroundColor: '$background',
      backgroundImage: 'url("/assets/bg-vertical.png")',
      backgroundRepeat: 'no-repeat',
      backgroundPositionY: '-100px',
      '@md': {
        backgroundColor: 'transparent',
        backgroundPositionX:
          'calc(100vw  - ($$asideMenuWidthMDCode + $$shadowWidth))',
      },
      '@lg': {
        backgroundPositionX:
          'calc(100vw  - ($$asideMenuWidthLGCode + $$shadowWidth))',
      },
      '@2xl': {
        backgroundPositionX:
          'calc($sizes$pageWidth + ((100vw - $sizes$pageWidth) /2 ) - ($$asideMenuWidthXLCode +  $$shadowWidth))',
      },
    },
    '&::after': {
      '@md': {
        left: 'calc(100vw  - ($$asideMenuWidthMDCode +  $sizes$4))',
      },
      '@lg': {
        left: 'calc(100vw  - ($$asideMenuWidthLGCode +  $sizes$4))',
      },
      '@2xl': {
        left: 'calc($sizes$pageWidth + ((100vw - $sizes$pageWidth) /2) - $$asideMenuWidthXLCode)',
      },
    },

    compoundVariants: [
      {
        isOpen: true,
        layout: 'code',
        css: {
          transform: 'translateX(0)',
          '&::before': {
            '@md': {
              '@md': {},
            },
          },
          '&::after': {
            '@md': {
              '@md': {},
            },
          },
        },
      },
    ],
  },
);

export const AsideBackground: StyledComponent<typeof BaseBackground> = styled(
  BaseBackground,
  {
    $$shadowWidth: '$sizes$25',
    '&::before': {
      content: '',
      position: 'absolute',
      pointerEvents: 'none',
      inset: 0,
      backgroundImage: 'url("/assets/bg-code.png")',
      backgroundRepeat: 'no-repeat',
      backgroundPositionY: '-100px',
      backgroundPositionX:
        'calc(100vw  - ($$asideMenuWidthMDDefault + $$shadowWidth))',

      '@2xl': {
        backgroundPositionX:
          'calc($sizes$pageWidth + ((100vw - $sizes$pageWidth) /2 ) - ($$asideMenuWidthLGDefault +  $$shadowWidth))',
      },
    },
    '&::after': {
      '@md': {
        left: 'calc(100vw  - ($$asideMenuWidthMDDefault + $sizes$4))',
      },
      '@2xl': {
        left: 'calc($sizes$pageWidth + ((100vw - $sizes$pageWidth) /2) - $$asideMenuWidthLGDefault)',
      },
    },
  },
);

export const Aside: StyledComponent<
  'aside',
  {
    layout?: 'code' | 'default';
    isOpen?: boolean | 'true' | 'false' | undefined;
  }
> = styled('aside', {
  gridArea: 'aside',
  overflowY: 'scroll',
  height: '100%',
  width: '100%',
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
        width: '100%',
      },
    },
  ],
  variants: {
    layout: {
      code: {
        backgroundColor: '$background',
        '@md': {
          backgroundColor: 'initial',
        },
        '@2xl': {
          maxWidth: '$$asideMenuWidthXLCode',
        },
      },
      default: {},
    },
    isOpen: {
      true: {},
      false: {},
    },
  },
});

export const AsideItem: StyledComponent<'li'> = styled('li', {
  lineHeight: '$base',
  a: {
    textDecoration: 'none',
    color: '$primaryHighContrast',
    '&:hover': {
      textDecoration: 'underline',
      fontWeight: '$bold',
    },
  },
});

export const AsideList: StyledComponent<
  'ul',
  { inner?: boolean | 'true' | 'false' | undefined }
> = styled('ul', {
  listStyle: 'none',
  margin: 0,
  padding: '0',

  '& li::before': {
    content: '∙',
    color: '$primaryHighContrast',
    fontWeight: '$bold',
    display: 'inline-block',
    width: '$4',
    margin: '0 $1',
  },

  variants: {
    inner: {
      true: {
        paddingLeft: '$4',
      },
      false: {},
    },
  },
});

export const StickyAsideWrapper: StyledComponent<'div'> = styled('div', {
  position: 'fixed',
  display: 'flex',
  top: '$20',
});

export const StickyAside: StyledComponent<'div'> = styled('div', {
  position: 'sticky',
  top: '$10',
});
