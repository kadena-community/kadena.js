import Link from 'next/link';
import type { FC, PropsWithChildren } from 'react';
import { floatClass } from './style.css';

interface IProps extends PropsWithChildren {
  href: string;
}

export const FloatButton: FC<IProps> = ({ href, children }) => {
  return (
    <Link className={floatClass} href={href}>
      {children}
    </Link>
  );
};
