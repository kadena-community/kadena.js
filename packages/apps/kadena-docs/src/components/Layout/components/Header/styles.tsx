import { config, styled, StyledComponent } from '@kadena/react-components';

import { Wrapper } from '../Main/styles';

import Link from 'next/link';

export const StyledHeader: StyledComponent<'header'> = styled(
  'header',
  {
    gridArea: 'header',
    backgroundColor: '#1D1D1F',
    color: 'white',
  },
  config,
);

export const InnerWrapper: StyledComponent<typeof Wrapper> = styled(Wrapper, {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  padding: '$3 $4',
});

export const StyleNav: StyledComponent<'nav'> = styled('nav', {
  display: 'flex',
  alignItems: 'center',
  zIndex: 1,
});

export const StyledUl: StyledComponent<'ul'> = styled('ul', {
  display: 'flex',
  gap: '$4',
  padding: 0,
  listStyle: 'none',
  width: '100%',
});

export const NavLink: StyledComponent<typeof Link> = styled(Link, {
  color: 'white',
  fontFamily: '$main',
  textDecoration: 'none',
  padding: '$1 $2',
  borderRadius: '$sm',

  variants: {
    'data-active': {
      true: {
        backgroundColor: 'rgba(255,255,255,0.8)',
        color: 'black',
      },
    },
  },
});

export const AnimationBackgroundWrapper: StyledComponent<'div'> = styled(
  'div',
  {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
  },
);
