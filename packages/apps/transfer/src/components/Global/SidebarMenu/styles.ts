import { styled } from '@kadena/react-components';

import Link from 'next/link';

export const StyledSidebar = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '25%',
  height: '100%',
});

export const StyledNavItem = styled(Link, {
  display: 'flex',
  justifyContent: 'flex-start',
  flexDirection: 'row',
  padding: '11px 22px',
  color: '#FFFFFF',
  background: 'rgba(71, 79, 82, 0.4)',
  '&:first-child': {
    borderTopLeftRadius: '4px',
    borderTopRightRadius: '4px',
  },
  '&:last-child': {
    borderBottomLeftRadius: '4px',
    borderBottomRightRadius: '4px',
  },
});

export const StyledSelectedNavItem = styled(Link, {
  display: 'flex',
  justifyContent: 'flex-start',
  flexDirection: 'row',
  padding: '11px 22px',
  fontWeight: '500',
  color: '#FFFFFF',
  background: 'rgba(5, 5, 5, 0.5);',
  '&:first-child': {
    borderTopLeftRadius: '4px',
    borderTopRightRadius: '4px',
  },
  '&:last-child': {
    borderBottomLeftRadius: '4px',
    borderBottomRightRadius: '4px',
  },
});

export const StyledNavItemIcon = styled('div', {
  paddingRight: '11px',
  fontWeight: '500',
});

export const StyledNavItemText = styled('span', {});
export const StyledNavItemSelectedText = styled('span', {
  textDecorationLine: 'underline',
});
