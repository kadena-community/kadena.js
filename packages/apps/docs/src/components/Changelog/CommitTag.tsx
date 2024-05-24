import Link from 'next/link';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { commitTagClass } from './styles.css';

interface IProps extends PropsWithChildren {
  url?: string;
}

export const CommitTag: FC<IProps> = ({ children, url }) => {
  return (
    <Link
      className={commitTagClass}
      rel="noreferrer"
      target="_blank"
      href={url ?? '#'}
    >
      {children}
    </Link>
  );
};
