import { Content } from '../components';

import { useCreateSubMenu } from './useCreateSubmenu';

import { ILayout, ISubHeaderElement } from '@/types/Layout';
import Link from 'next/link';
import React, { FC, ReactNode } from 'react';

export const Full: FC<ILayout> = ({ children }) => {
  const { headers } = useCreateSubMenu();

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
    <>
      <Content id="maincontent">
        <ul>{headers.map(renderListItem)}</ul>
        {children}
      </Content>
    </>
  );
};

Full.displayName = 'Full';
