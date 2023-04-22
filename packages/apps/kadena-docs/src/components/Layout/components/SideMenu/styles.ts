import { styled, StyledComponent } from '@kadena/react-components';

import Link from 'next/link';

export const StyledSideMenu: StyledComponent<'div'> = styled('div', {
  position: 'relative',
  marginTop: '$6',
});

export const StyledUl: StyledComponent<'ul'> = styled('ul', {
  listStyle: 'none',
  padding: 0,
});

export const StyledItem: StyledComponent<'li'> = styled('li', {
  borderBottom: '1px solid $neutral3',
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
    transform: 'rotate(45deg) translate(-$sizes$1, $sizes$1)',
    transition: 'transform .2s ease ',
  },
  '&:hover': {
    color: '$primaryContrast',

    '&::after': {
      opacity: 1,
      transform: 'rotate(45deg) translate(0, 0)',
    },
  },
});

export const StyledSection: StyledComponent<
  'section',
  {
    active?: boolean | 'true' | 'false' | undefined;
    animateLeft2Right?: boolean | 'true' | 'false' | undefined;
  }
> = styled('section', {
  position: 'absolute',
  top: 0,
  transition: 'transform .2s ease',
  margin: '$16 0',
  padding: '0 $4',
  width: '100%',
  defaultVariants: {
    active: false,
    animateLeft2Right: true,
  },
  variants: {
    active: {
      true: {
        transform: 'translateX(0)',
      },
      false: {},
    },
    animateLeft2Right: {
      false: {},
      true: {},
    },
  },
  compoundVariants: [
    {
      active: false,
      animateLeft2Right: true,
      css: {
        transform: 'translateX(-100%)',
      },
    },
    {
      active: false,
      animateLeft2Right: false,
      css: {
        transform: 'translateX(100%)',
      },
    },
  ],
});

const TitleStyleBase: Record<string, string | number> = {
  display: 'block',
  background: 'transparent',
  padding: '0 0 0 $8',
  textAlign: 'left',
  border: 0,
  cursor: 'pointer',
};

export const SideMenuTitle: StyledComponent<'div'> = styled(
  'div',
  TitleStyleBase,
);

export const SideMenuTitleBackButton: StyledComponent<'button'> = styled(
  'button',
  {
    ...TitleStyleBase,
    '&:hover': {
      '&::before': {
        transform: 'translate(0, $sizes$2) rotate(45deg) ',
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
      transform: 'translate($sizes$2, $sizes$2) rotate(45deg)',
      transition: 'transform .2s ease ',
    },

    '@md': {
      display: 'none',
    },
  },
);
