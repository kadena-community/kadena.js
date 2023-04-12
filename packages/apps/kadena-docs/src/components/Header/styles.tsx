import { config, styled } from '@kadena/react-components';

import Link from 'next/link';
import { FC, ReactNode } from 'react';

type StyledComponentType<T = HTMLElement> = FC<{
  children?: ReactNode | {};
  ref?: React.ForwardedRef<T>;
  href?: unknown;
}>;

export const StyledHeader: StyledComponentType = styled(
  'header',
  {
    backgroundColor: '#1D1D1F',
    color: 'white',
  },
  config,
);

export const Wrapper: StyledComponentType<HTMLDivElement> = styled('div', {
  display: 'flex',
  margin: '0',
  padding: '$3 $4',
});

export const StyleNav: StyledComponentType = styled('nav', {
  display: 'flex',
  alignItems: 'center',
  zIndex: 1,
});

export const StyledUl: StyledComponentType<HTMLUListElement> = styled('ul', {
  display: 'flex',
  gap: '$4',
  padding: 0,
  listStyle: 'none',
  width: '100%',
});

export const NavLink: StyledComponentType<HTMLAnchorElement> = styled(Link, {
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

export const AnimationBackgroundWrapper: StyledComponentType<HTMLDivElement> =
  styled('div', {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
  });
