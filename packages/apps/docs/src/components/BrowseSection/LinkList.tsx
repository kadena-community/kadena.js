import type { FC, ReactNode } from 'react';
import React from 'react';
import { LinkList as InnerLinkList } from '../LinkList/LinkList';
import { listItemClass } from './styles.css';

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
