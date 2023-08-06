import { Heading, IHeadingProps } from '@kadena/react-ui';

import { ILinkBlock, LinkBlock } from './LinkBlock';
import { ILinkList, LinkList } from './LinkList';
import {
  columnLinkClass,
  columnLinkListItemClass,
  sectionRowContainerClass,
  directionVariants,
} from './styles.css';

import classnames from 'classnames';
import Link from 'next/link';
import React, { FC, FunctionComponentElement } from 'react';

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
    [sectionRowContainerClass]: direction === 'row',
  });

  const listItemClassName = classnames({
    [columnLinkListItemClass]: direction === 'row',
  });

  return (
    <section className={containerClass}>
      {Boolean(title) && <Heading as={titleAs}>{title}</Heading>}
      <ul className={directionVariants[direction]}>
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
                className: columnLinkClass,
              });

              return <li className={columnLinkListItemClass}>{childWithProps}</li>;
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
