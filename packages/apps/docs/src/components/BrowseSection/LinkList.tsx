import { LinkList as InnerLinkList } from '../LinkList';

import { listItemClass } from './styles.css';

import React, { type FC, type ReactNode } from 'react';

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
