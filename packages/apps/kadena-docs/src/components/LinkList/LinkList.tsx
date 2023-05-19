import { Heading } from '@kadena/react-components';

import { StyledLinkList } from './styles';

import Link from 'next/link';
import React, { FC, ReactNode } from 'react';

export interface ILinkList {
  children?: ReactNode;
  title?: string;
}

export const LinkList: FC<ILinkList> = ({ children, title }) => {
  return (
    <div>
      {Boolean(title) && <Heading as="h6">{title}</Heading>}
      <StyledLinkList>
        {React.Children.map(children, (child) => {
          if (
            !React.isValidElement(child) ||
            (child.type !== Link && child.props.href === undefined)
          ) {
            throw new Error('not a valid link');
          }
          return <li>{child}</li>;
        })}
      </StyledLinkList>
    </div>
  );
};
