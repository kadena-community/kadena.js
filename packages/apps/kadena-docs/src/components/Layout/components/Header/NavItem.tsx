import { styled } from '@kadena/react-components';

import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC, ReactNode } from 'react';

interface IProps {
  children?: ReactNode;
  href: string;
}

const NavLink = styled(Link, {
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

export const NavItem: FC<IProps> = ({ children, href = '' }) => {
  const router = useRouter();
  const active = href === router.pathname
  return (
    <li data-active={active}>
      <NavLink active={active} href={href}>
        {children}
      </NavLink>
    </li>
  );
};
