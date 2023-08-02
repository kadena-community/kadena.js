import { Heading, IHeadingProps } from '@kadena/react-ui';

import { ILinkBlock, LinkBlock } from './LinkBlock';
import { ILinkList, LinkList } from './LinkList';
import {
  sectionRowContainer,
  columnLinkList,
  rowLinkList,
  columnLinkListItem,
  columnLink,
} from './styles.css';

import Link from 'next/link';
import React, { FC, FunctionComponentElement } from 'react';
import classnames from 'classnames';

export interface IBrowseSectionProps {
  title?: string;
  titleAs?: IHeadingProps['as'];
  children?:
    | FunctionComponentElement<ILinkBlock>[]
    | FunctionComponentElement<ILinkBlock>;
  direction?: 'column' | 'row';
  className?: string;
}

export type BrowseSectionType = FC<IBrowseSectionProps> & {
  LinkBlock: FC<ILinkBlock>;
  LinkList: FC<ILinkList>;
};

const BrowseSection: BrowseSectionType = ({
  /* eslint-disable-next-line react/prop-types */
  children,
  /* eslint-disable-next-line react/prop-types */
  title,
  /* eslint-disable-next-line react/prop-types */
  titleAs = 'h6',
  /* eslint-disable-next-line react/prop-types */
  direction = 'column',
  /* eslint-disable-next-line react/prop-types */
  className,
}) => {
  const containerClass = classnames(className, {
    [sectionRowContainer]: direction === 'row',
  });

  const listClassName = classnames({
    [columnLinkList]: direction === 'column',
    [rowLinkList]: direction === 'row',
  });

  const listItemClassName = classnames({
    [columnLinkListItem]: direction === 'row',
  });

  return (
    <section className={containerClass}>
      {Boolean(title) && <Heading as={titleAs}>{title}</Heading>}
      <ul className={listClassName}>
        {React.Children.map(children, (child) => {
          if (
            !React.isValidElement(child) ||
            (child.type !== LinkBlock &&
              child.type !== Link &&
              child.type !== 'a')
          ) {
            throw new Error('not a child for the BrowseSection Component');
          }

          if (child.type === LinkBlock) {
            return child;
          }

          if (child.type !== LinkBlock) {
            if (React.isValidElement(child)) {
              const childWithProps = React.cloneElement(child, {
                // @ts-ignore
                className: columnLink,
              });

              return <li className={columnLinkListItem}>{childWithProps}</li>;
            }
          }

          return <li className={listItemClassName}>{child}</li>;
        })}
      </ul>
    </section>
  );
};

BrowseSection.LinkBlock = LinkBlock;
BrowseSection.LinkList = LinkList;

export { BrowseSection };
