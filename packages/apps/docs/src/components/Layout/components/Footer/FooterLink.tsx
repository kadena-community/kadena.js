import { Text } from '@kadena/react-ui';

import { linkClass } from './styles.css';

import Link from 'next/link';
import type { FC, ReactNode } from 'react';
import React from 'react';

interface IProps {
  children?: ReactNode;
  href: string;
}

export const FooterLink: FC<IProps> = ({ children, href }) => {
  const isInnerLink = href.includes('http');

  return (
    <Text size="md" bold={false}>
      {isInnerLink ? (
        <a href={href} className={linkClass}>
          {children}
        </a>
      ) : (
        <Link href={href} className={linkClass}>
          {children}
        </Link>
      )}
    </Text>
  );
};
