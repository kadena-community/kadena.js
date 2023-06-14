import { styled } from '@kadena/react-components';

import Link from 'next/link';

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
  '&.active': {
    background: 'rgba(5, 5, 5, 0.5);',
    fontWeight: '500',
  },
});

export const StyledNavItemText = styled('span', {
  '&.active': {
    textDecorationLine: 'underline',
  },
});

export const StyledNavItemIcon = styled('div', {
  paddingRight: '11px',
  fontWeight: '500',
});
