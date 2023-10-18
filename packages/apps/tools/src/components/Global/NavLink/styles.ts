import { styled } from '@kadena/react-components';
import Link from 'next/link';

export const StyledNavItem = styled(Link, {
  display: 'flex',
  justifyContent: 'flex-start',
  flexDirection: 'row',
  py: '$3',
  px: '$6',
  color: '#FFFFFF',
  background: 'rgba(71, 79, 82, 0.4)',
  '&:first-child': {
    borderTopLeftRadius: '$1',
    borderTopRightRadius: '$1',
  },
  '&:last-child': {
    borderBottomLeftRadius: '$1',
    borderBottomRightRadius: '$1',
  },
  '&.active': {
    background: 'rgba(5, 5, 5, 0.5);',
    fontWeight: '$medium',
  },
});

export const StyledNavItemText = styled('span', {
  '&.active': {
    textDecorationLine: 'underline',
  },
});

export const StyledNavItemIcon = styled('div', {
  paddingRight: '$3',
  fontWeight: '$medium',
});
