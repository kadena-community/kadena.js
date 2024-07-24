import { Text } from '@kadena/kode-ui';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { footerLinkClass } from './style.css';

interface IProps extends PropsWithChildren {
  href: string;
  onClick: () => void;
}

export const FooterLink: FC<IProps> = ({ onClick, href, children }) => {
  return (
    <a onClick={onClick} className={footerLinkClass} href={href} target="_bank">
      <Text>{children}</Text>
    </a>
  );
};
