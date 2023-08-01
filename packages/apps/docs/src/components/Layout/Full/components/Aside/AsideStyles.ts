import { styled, StyledComponent } from '@kadena/react-components';

import Link from 'next/link';

export const BaseBackground: StyledComponent<
  'div',
  {
    isOpen?: boolean | 'true' | 'false' | undefined;
  }
> = styled('div', {
  position: 'absolute',
  pointerEvents: 'none',
  width: '100vw',
  height: '100vh',
  zIndex: 0,
  transform: 'translateX(100vw)',

  '@md': {
    position: 'fixed',
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

export const AsideBackground: StyledComponent<typeof BaseBackground> = styled(
  BaseBackground,
  {
    $$shadowWidth: '$sizes$25',
    display: 'none',
    '@md': {
      display: 'block',
    },
    '&::before': {
      content: '',
      position: 'absolute',
      pointerEvents: 'none',
      inset: 0,
      zIndex: 0,
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
  display: 'none',
  gridArea: 'aside',
  height: '100%',
  width: '100%',
  gridColumn: '4 / span 2',
  gridRow: '2 / span 2',

  zIndex: '$sideMenu',
  padding: '0 $4',
  position: 'absolute',
  transform: 'translateX(100vw)',

  '@md': {
    display: 'block',
    transform: 'translateX(0)',
  },
  compoundVariants: [
    {
      isOpen: true,
      layout: 'code',
      css: {
        display: 'block',
        transform: 'translateX(0)',
        width: '100%',
      },
    },
  ],
  variants: {
    layout: {
      code: {
        '@md': {
          backgroundColor: 'initial',
        },
        '@2xl': {
          maxWidth: '$$asideMenuWidthCode',
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
});

export const AsideItemLink: StyledComponent<
  typeof Link,
  { isActive?: boolean | 'true' | 'false' }
> = styled(Link, {
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },

  defaultVariants: {
    isActive: false,
  },
  variants: {
    isActive: {
      true: {
        color: '$neutral6',
        textDecoration: 'underline',
      },
      false: {
        color: '$primaryHighContrast',
      },
    },
  },
});

export const AsideList: StyledComponent<
  'ul',
  { inner?: boolean | 'true' | 'false' | undefined }
> = styled('ul', {
  listStyle: 'initial',
  listStylePosition: 'outside',
  margin: 0,
  padding: '0',

  '& li::marker': {
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
  position: 'sticky',
  display: 'flex',
  top: '$10',
  paddingLeft: '$4',
});

export const StickyAside: StyledComponent<'div'> = styled('div', {
  paddingTop: '$10',
  height: 'calc(100vh - $20)',
  overflowY: 'scroll',
});
