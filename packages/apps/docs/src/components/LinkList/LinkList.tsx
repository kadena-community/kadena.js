import { Heading } from '@kadena/react-ui';

import { list, listItem, link } from './styles.css';

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
      <ul className={list}>
        {React.Children.map(children, (child) => {
          if (
            !React.isValidElement(child) ||
            (child.type !== Link && child.props.href === undefined)
          ) {
            throw new Error('not a valid link');
          }
          const childWithProps = React.cloneElement(child, {
            // @ts-ignore
            className: link,
          });
          return <li className={listItem}>{childWithProps}</li>;
        })}
      </ul>
    </div>
  );
};
