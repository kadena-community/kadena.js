import { styled, StyledComponent } from '@kadena/react-components';

import Link from 'next/link';

export const StyledSideMenu: StyledComponent<'div'> = styled('div', {
  position: 'relative',
  marginTop: '$6',
});

export const Menu: StyledComponent<
  'div',
  { isOpen?: boolean | 'true' | 'false' | undefined }
> = styled('div', {
  gridArea: 'menu',
  position: 'absolute',
  top: '$17',
  height: 'calc(100% - $17 - $17)',
  width: '100%',
  borderRight: '1px solid $borderColor',
  background: '$background',
  overflow: 'hidden',
  transform: 'translateX(-100%)',
  transition: 'transform .3s ease, width .3s ease',

  '@sm': {
    width: '256px',
  },
  '@md': {
    position: 'relative',
    top: '0',
    height: '100%',
    transform: 'translateX(0)',
  },

  variants: {
    isOpen: {
      true: {
        transform: 'translateX(0)',
      },
      false: {
        transform: 'translateX(-100%)',
        '@md': {
          transform: 'translateX(0)',
        },
      },
    },
  },
});

export const StyledUl: StyledComponent<'ul'> = styled('ul', {
  listStyle: 'none',
  padding: 0,
});

export const StyledItem: StyledComponent<'li'> = styled('li', {
  borderBottom: '1px solid $borderColor',
  padding: '$4 0 $2',
});

export const StyledLink: StyledComponent<typeof Link> = styled(Link, {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  color: '$neutral4',
  fontWeight: '$semiBold',
  textDecoration: 'none',
  '&::after': {
    position: 'absolute',
    right: '$2',
    content: '',
    width: '$2',
    height: '$2',
    borderRight: '2px solid $neutral4',
    borderTop: '2px solid $neutral4',
    opacity: 0,
    transform: 'rotate(45deg) translate(-5px, 5px)',
    transition: 'transform .2s ease ',
  },
  '&:hover': {
    color: '$primarySurfaceInverted',

    '&::after': {
      opacity: 1,
      transform: 'rotate(45deg) translate(0px, 0px)',
    },
  },
});

export const StyledSection: StyledComponent<
  'section',
  {
    active?: boolean | 'true' | 'false' | undefined;
    l2r?: boolean | 'true' | 'false' | undefined;
  }
> = styled('section', {
  position: 'absolute',
  top: 0,
  transition: 'transform .2s ease',
  margin: '$16 0',
  padding: '0 $6',
  width: '100%',
  defaultVariants: {
    active: false,
    l2r: true,
  },
  variants: {
    active: {
      true: {
        transform: 'translateX(0)',
      },
      false: {},
    },
    l2r: {
      false: {},
      true: {},
    },
  },
  compoundVariants: [
    {
      active: false,
      l2r: true,
      css: {
        transform: 'translateX(-100%)',
      },
    },
    {
      active: false,
      l2r: false,
      css: {
        transform: 'translateX(100%)',
      },
    },
  ],
});

const titleStyle: Record<string, string | number> = {
  display: 'block',
  background: 'transparent',
  padding: '0 0 0 $8',
  textAlign: 'left',
  border: 0,
  cursor: 'pointer',
};

export const SideMenuTitle: StyledComponent<'div'> = styled('div', titleStyle);

export const SideMenuTitleBackButton: StyledComponent<'button'> = styled(
  'button',
  {
    ...titleStyle,
    display: 'block',
    '&:hover': {
      '&::before': {
        transform: 'rotate(45deg) translate(6px, 6px)',
      },
    },

    '&::before': {
      position: 'absolute',
      left: '$2',
      content: '',
      width: '$2',
      height: '$2',
      borderLeft: '2px solid $neutral4',
      borderBottom: '2px solid $neutral4',
      transform: 'rotate(45deg) translate(12px, 0px)',
      transition: 'transform .2s ease ',
    },

    '@md': {
      display: 'none',
    },
  },
);
