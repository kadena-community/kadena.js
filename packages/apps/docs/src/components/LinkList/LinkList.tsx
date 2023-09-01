import { Heading } from '@kadena/react-ui';

import { linkClass, listClass, listItemClass } from './styles.css';

import Link from 'next/link';
import React, { type FC, type ReactNode } from 'react';

export interface ILinkList {
  children?: ReactNode;
  title?: string;
}

export const LinkList: FC<ILinkList> = ({ children, title }) => {
  return (
    <div>
      {Boolean(title) && <Heading as="h6">{title}</Heading>}
      <ul className={listClass}>
        {React.Children.map(children, (child) => {
          if (
            !React.isValidElement(child) ||
            (child.type !== Link && child.props.href === undefined)
          ) {
            throw new Error('not a valid linkClass');
          }
          const childWithProps = React.cloneElement(child, {
            // @ts-ignore
            className: linkClass,
          });
          return <li className={listItemClass}>{childWithProps}</li>;
        })}
      </ul>
    </div>
  );
};
