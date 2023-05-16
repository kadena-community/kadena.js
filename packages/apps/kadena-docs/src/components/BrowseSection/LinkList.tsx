import { LinkList as InnerLinkList } from '../LinkList';

import { StyledListItem } from './styles';

import React, { FC, ReactNode } from 'react';

export interface ILinkList {
  title: string;
  children?: ReactNode;
}

export const LinkList: FC<ILinkList> = ({ title, children }) => {
  return (
    <StyledListItem>
      <InnerLinkList title={title}>{children}</InnerLinkList>
    </StyledListItem>
  );
};
