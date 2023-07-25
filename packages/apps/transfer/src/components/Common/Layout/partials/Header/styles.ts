import { darkTheme, styled, StyledComponent } from '@kadena/react-components';
import { IconButton } from '@kadena/react-ui';

import { Container, GridRow } from '@/components/Global';
import { NavBackground } from '@/resources/svg/generated';
import Link from 'next/link';

// eslint-disable-next-line @kadena-dev/typedef-var
const menuHeight = '$16';

export const StyledHeader = styled('header', {
  backgroundColor: '$neutral5',
  color: '$neutral2',
  borderBottom: `1px solid $neutral4`,

  [`.${darkTheme} &`]: {
    background: '$neutral2',
    color: '$neutral5',
    borderBottom: `1px solid $neutral3`,
  },
});

export const StyledContainer = styled(Container, {
  position: 'relative',
  px: '$4',
  py: '$2',
  height: menuHeight,
});

export const StyledGridRow = styled(GridRow, {
  position: 'relative',
  alignItems: 'center',
  zIndex: 1,
});

export const StyledLeftPanelWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
});

export const StyledLogoWrapper = styled('div', {
  mr: '$2',
});

export const StyledTitle = styled(Link, {
  color: 'inherit',
  fontSize: '$base',
  '&:hover': {
    color: 'inherit',
  },
});

export const StyledMenuItem = styled(Link, {
  fontSize: '$base',
  fontWeight: '$medium',
  color: '$neutral3',
  transition: 'color 0.2s',
  padding: '$2 0',

  '&:not(:last-child)': {
    mr: '$6',
  },
  '&:hover': {
    color: '$white',
  },

  [`.${darkTheme} &`]: {
    color: '$neutral4',
  },
});

export const StyledBackgroundGlow = styled(NavBackground, {
  position: 'absolute',
  top: '0',
  left: '-$4',
  zIndex: 0,
});

export const StyledBurgerMenuButton: StyledComponent<typeof IconButton> =
  styled(IconButton);

export const StyledMobileMenu = styled('div', {
  backgroundColor: '$neutral5',
  display: 'flex',
  flexDirection: 'column',
  padding: '0 $4 $4',
  position: 'absolute',
  right: '0',
  width: '100%',
  overflow: 'hidden',
  transition: 'transform 0.2s linear',
  transformOrigin: 'top center',

  '@md': {
    width: '50%',
  },
  '@lg': {
    display: 'none',
  },

  [`.${darkTheme} &`]: {
    background: '$neutral2',
  },

  variants: {
    status: {
      open: {
        transform: 'rotateX(0)',
      },
      close: {
        transform: 'rotateX(90deg)',
      },
    },
  },
});

export const StyledNav = styled('nav', {
  variants: {
    type: {
      mobile: {
        display: 'flex',
        flexDirection: 'column',
        mb: '$2',
      },
      desktop: {
        display: 'block',
      },
    },
  },
});
