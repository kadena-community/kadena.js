import { LinkList as InnerLinkList } from '../LinkList';

import { listItemClass } from './styles.css';

import type { FC, ReactNode } from 'react';
import React from 'react';

export interface ILinkList {
  title: string;
  children?: ReactNode;
}

export const LinkList: FC<ILinkList> = ({ title, children }) => {
  return (
    <li className={listItemClass}>
      <InnerLinkList title={title}>{children}</InnerLinkList>
    </li>
  );
};
