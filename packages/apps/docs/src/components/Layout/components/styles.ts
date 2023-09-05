import { darkTheme, styled, StyledComponent } from '@kadena/react-components';

import { HeaderIconGroup } from './Header/styles';

import Link from 'next/link';

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

export const StyledLogoWrapper: StyledComponent<'div'> = styled('div', {
  zIndex: '$navMenu',
});
