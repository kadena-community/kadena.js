import { LinkList as InnerLinkList } from '../LinkList';

import { listItem } from './styles.css';

import React, { FC, ReactNode } from 'react';

export interface ILinkList {
  title: string;
  children?: ReactNode;
}

export const LinkList: FC<ILinkList> = ({ title, children }) => {
  return (
    <li className={listItem}>
      <InnerLinkList title={title}>{children}</InnerLinkList>
    </li>
  );
};
