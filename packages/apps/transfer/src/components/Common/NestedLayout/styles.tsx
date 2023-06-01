import { styled } from '@kadena/react-components';

import BackButton from './BackButton';
import NavItem from './NavItem';

import Link from 'next/link';

export const StyledContainer = styled('div', {
  padding: '1.5rem', //  24px
});

export const StyledHeader = styled('header', {
  display: 'flex',
  justifyContent: 'space-between',
});

export const StyledHeaderTitle = styled('div', {
  flexGrow: 1,
});

export const StyledBodyContainer = styled('section', {
  display: 'flex',
  flexDirection: 'row',
  columnGap: '2.5rem', // 40px
});

export const StyledNav = styled('nav', { flexBasis: '25%;' });

export const StyledBackButton = styled(BackButton, {
  marginBottom: '3rem', // 48px
});

export const StyledTopNavItem = styled(NavItem, {
  borderTopLeftRadius: '0.25rem', // 4px
  borderTopRightRadius: '0.25rem', // 4px
});

export const StyledBottomNavItem = styled(NavItem, {
  borderBottomLeftRadius: '0.25rem', // 4px
  borderBottomRightRadius: '0.25rem', // 4px
});

export const StyledBody = styled('section', {
  flexBasis: '75%;',
});

export const StyledBodyTitle = styled('h1', {
  marginBottom: '3rem', // 48px
});

export const StyledLink = styled(Link, {
  display: 'block',
  paddingLeft: '1.25rem', // 20px
  paddingRight: '1.25rem', // 20px
  lineHeight: '2.5rem', // 40px
  backgroundColor: 'rgb(80 80 80 / 0.5)',
  fontWeight: 400,
});
