import { Heading } from '@kadena/react-components';

import { LinkList as InnerLinkList } from '../LinkList';

import { ItemStack, ItemSubHeader, StyledListItem } from './styles';

import Link from 'next/link';
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
