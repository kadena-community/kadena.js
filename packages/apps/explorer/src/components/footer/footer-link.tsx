import { Text } from '@kadena/react-ui';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { footerLinkClass } from './style.css';

interface IProps extends PropsWithChildren {
  href: string;
}

const FooterLink: FC<IProps> = ({ href, children }) => {
  return (
    <a className={footerLinkClass} href={href} target="_bank">
      <Text>{children}</Text>
    </a>
  );
};

export default FooterLink;
