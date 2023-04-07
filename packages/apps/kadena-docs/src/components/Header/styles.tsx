import { styled } from '@kadena/react-components';

import Link from 'next/link';

export const StyledHeader = styled('header', {
  backgroundColor: '#1D1D1F',
  color: 'white',
});

export const Wrapper = styled('div', {
  display: 'flex',
  margin: '0',
  padding: '$3 $4',
});

export const StyleNav = styled('nav', {
  display: 'flex',
  alignItems: 'center',
  zIndex: 1,
});

export const StyledUl = styled('ul', {
  display: 'flex',
  gap: '$4',
  padding: 0,
  listStyle: 'none',
  width: '100%',
});

export const NavLink = styled(Link, {
  color: 'white',
  fontFamily: '$main',
  textDecoration: 'none',
  padding: '$1 $2',
  borderRadius: '$sm',

  variants: {
    active: {
      true: {
        backgroundColor: 'rgba(255,255,255,0.8)',
        color: 'black',
      },
    },
  },
});

export const AnimationBackgroundWrapper = styled('div', {
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 0,
});
