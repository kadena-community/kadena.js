import { Text } from '@kadena/react-ui';
import Link from 'next/link';
import type { FC, ReactNode } from 'react';
import React from 'react';
import { linkClass } from './styles.css';

interface IProps {
  children?: ReactNode;
  href: string;
}

export const FooterLink: FC<IProps> = React.forwardRef<
  HTMLAnchorElement,
  IProps
>(({ children, href }, ref) => {
  const isInnerLink = href.includes('http');

  return (
    <Text size="small">
      {isInnerLink ? (
        <a ref={ref} href={href} className={linkClass}>
          {children}
        </a>
      ) : (
        <Link ref={ref} href={href} className={linkClass}>
          {children}
        </Link>
      )}
    </Text>
  );
});

FooterLink.displayName = 'FooterLink';
