import { AsideItem } from './AsideStyles';

import Link from 'next/link';
import React, { FC, ReactNode } from 'react';

interface IProps {
  children?: ReactNode;
  href: string;
  label?: string;
}

export const AsideLink: FC<IProps> = ({ children, href, label }) => {
  return (
    <AsideItem>
      <Link href={href}>{label}</Link>
      {children}
    </AsideItem>
  );
};
