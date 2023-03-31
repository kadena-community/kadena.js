import { styled } from '@kadena/react-components';
import Link from 'next/link';
import React, { FC, MouseEventHandler, ReactNode } from 'react';

type IProps = {
  children?: ReactNode;
  href: string;
  active: boolean;
};

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

export const NavItem: FC<IProps> = ({ children, href = '', active }) => {
  return (
    <li data-active={active}>
      <NavLink active={active} href={href}>
        {children}
      </NavLink>
    </li>
  );
};
