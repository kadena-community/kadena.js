import type { StyledComponent } from '@kadena/react-components';
import { darkTheme, styled } from '@kadena/react-components';

import { HeaderIconGroup } from './Header/styles';

import Link from 'next/link';

export const Wrapper: StyledComponent<'div'> = styled('div', {
  maxWidth: '$pageWidth',
  margin: '0 auto',
});

export const BasePageGrid: StyledComponent<'div'> = styled('div', {
  $$asideMenuWidthMDDefault: '200px',
  $$asideMenuWidthLGDefault: '300px',
  $$asideMenuWidthCode: '400px',

  display: 'grid',
  gridTemplateRows: '0 auto 1fr auto',
  gridTemplateColumns: 'auto auto',
  gridTemplateAreas: `
      "header header"
      "pageheader pageheader"
      "content content"
      "footer footer"
    `,
  position: 'relative',
  margin: '0 auto',
  minHeight: '100vh',
  '@md': {
    gridTemplateColumns:
      '1% $leftSideWidth minmax(auto, calc($pageWidth - $leftSideWidth - $$asideMenuWidthMDDefault)) $$asideMenuWidthMDDefault 1%',
    gridTemplateAreas: `
        "header header header header header"
        "pageheader pageheader pageheader pageheader pageheader"
        ". menu content aside ."
        "footer footer footer footer footer"
      `,
  },

  '@2xl': {
    gridTemplateColumns:
      'auto $leftSideWidth minmax(auto, calc($pageWidth - $leftSideWidth - $$asideMenuWidthLGDefault)) $$asideMenuWidthLGDefault auto',
  },
});

export const StyledHeader: StyledComponent<'header'> = styled('header', {
  position: 'sticky',
  top: 0,
  gridArea: 'header',
  backgroundColor: '$neutral5',
  color: 'white',
  zIndex: '$navMenu',

  [`.${darkTheme} &`]: {
    background: '$neutral2',

    [`& ${HeaderIconGroup} svg`]: {
      color: '$neutral5',
    },
  },
});

export const InnerWrapper: StyledComponent<typeof Wrapper> = styled(Wrapper, {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  padding: '$3 $4',
});

export const StyledNav: StyledComponent<'nav'> = styled('nav', {
  display: 'none',
  alignItems: 'center',
  zIndex: 1,
  '@md': {
    display: 'flex',
  },
});

export const StyledUl: StyledComponent<
  'ul',
  { ref?: React.ForwardedRef<HTMLUListElement> }
> = styled('ul', {
  display: 'flex',
  gap: '$4',
  padding: 0,
  listStyle: 'none',
  width: '100%',
});

export const NavLink: StyledComponent<
  typeof Link,
  { active?: boolean | 'true' | 'false' | undefined }
> = styled(Link, {
  color: '$neutral100',
  fontFamily: '$main',
  textDecoration: 'none',
  padding: '$1 clamp($1, .5vw, $2)',
  borderRadius: '$sm',
  fontSize: 'clamp(14px, 1.4vw, 16px)',
  '&:hover': {
    color: '$neutral100',
    opacity: '.5',
  },

  variants: {
    active: {
      true: {
        backgroundColor: 'rgba(255,255,255,0.8)',

        color: '$neutral000',

        '&:hover': {
          color: '$neutral000',
          opacity: '.8',
        },
      },
      false: {},
    },
  },
});

export const AnimationBackgroundWrapper: StyledComponent<
  'div',
  { show?: boolean | 'true' | 'false' | undefined }
> = styled('div', {
  position: 'absolute',

  top: 0,
  left: 0,
  zIndex: 0,
  opacity: 0,

  defaultVariants: {
    show: true,
  },
  variants: {
    show: {
      true: {
        opacity: 1,
      },
      false: {
        opacity: 0,
      },
    },
  },
});

export const Spacer: StyledComponent<'div'> = styled('div', {
  flex: 1,
});

export const StyledLogoWrapper: StyledComponent<'div'> = styled('div', {
  zIndex: '$navMenu',
});
