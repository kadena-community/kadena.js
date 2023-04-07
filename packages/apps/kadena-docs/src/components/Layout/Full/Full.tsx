import { Main } from '../components';
import { ILayout } from '../types';

import { useCreateSubMenu } from './useCreateSubmenu';

import { ISubElement } from '@/types/Layout';
import React, { FC, ReactNode } from 'react';

export const Full: FC<ILayout> = ({ children }) => {
  const { docRef, headers } = useCreateSubMenu();

  const renderListItem = (item: ISubElement): ReactNode => {
    return (
      <li>
        {item.title}

        {item.children.length > 0 && (
          <ul>{item.children.map(renderListItem)}</ul>
        )}
      </li>
    );
  };
  return (
    <Main ref={docRef}>
      <ul>{headers.map(renderListItem)}</ul>
      <h1>Full</h1>
      {children}
    </Main>
  );
};

Full.displayName = 'Full';
