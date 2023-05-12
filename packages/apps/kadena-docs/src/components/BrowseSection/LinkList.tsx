import { Heading } from '@kadena/react-components';

import {
  ItemStack,
  ItemSubHeader,
  StyledLinkList,
  StyledListItem,
} from './styles';

import Link from 'next/link';
import React, { FC, ReactNode } from 'react';

export interface ILinkList {
  title: string;
  children?: ReactNode;
}

export const LinkList: FC<ILinkList> = ({ title, children }) => {
  return (
    <StyledListItem>
      <Heading as="h5">{title}</Heading>

      <StyledLinkList>
        {React.Children.map(children, (child) => {
          if (
            !React.isValidElement(child) ||
            (child.type !== Link && child.props.href === undefined)
          ) {
            throw new Error('not a valid link');
          }
          return (
            <li>
              <a></a>
              {child}
            </li>
          );
        })}
      </StyledLinkList>
    </StyledListItem>
  );
};
