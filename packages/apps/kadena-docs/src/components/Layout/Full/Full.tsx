import { Main } from '../components';
import { ILayout } from '../types';

import { useCreateSubMenu } from './useCreateSubmenu';

import { ISubHeaderElement } from '@/types/Layout';
import Link from 'next/link';
import React, { FC, ReactNode } from 'react';

export const Full: FC<ILayout> = ({ children }) => {
  const { docRef, headers } = useCreateSubMenu();

  const renderListItem = (item: ISubHeaderElement): ReactNode => {
    return (
      <li key={item.slug}>
        <Link href={`#${item.slug}`}>{item.title}</Link>

        {item.children.length > 0 && (
          <ul>{item.children.map(renderListItem)}</ul>
        )}
      </li>
    );
  };
  return (
    <Main ref={docRef}>
      <ul>{headers.map(renderListItem)}</ul>
      {children}
    </Main>
  );
};

Full.displayName = 'Full';
