import type { IHeadingProps } from '@kadena/react-ui';
import { Heading, Link } from '@kadena/react-ui';

import type { ILinkBlock } from './LinkBlock';
import { LinkBlock } from './LinkBlock';
import type { ILinkList } from './LinkList';
import { LinkList } from './LinkList';
import {
  columnLinkClass,
  columnLinkListItemClass,
  directionVariants,
  sectionRowContainerClass,
} from './styles.css';

import classNames from 'classnames';
import NextLink from 'next/link';
import type { FC, ReactNode } from 'react';
import React from 'react';

interface IBrowseSectionProps {
  title?: string;
  titleAs?: IHeadingProps['as'];
  children?: ReactNode;
  direction?: 'column' | 'row';
  className?: string;
}

type BrowseSectionType = FC<IBrowseSectionProps> & {
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
  const containerClass = classNames(className, {
    [sectionRowContainerClass]: direction === 'row',
  });

  const listItemClassName = classNames({
    [columnLinkListItemClass]: direction === 'row',
  });

  return (
    <section className={containerClass}>
      {Boolean(title) && <Heading as={titleAs}>{title}</Heading>}
      <ul className={directionVariants[direction]}>
        {React.Children.map(children, (child) => {
          if (!child) return child;
          if (
            !React.isValidElement(child) ||
            (child.type !== LinkBlock &&
              child.type !== NextLink &&
              child.type !== Link &&
              child.type !== 'a' &&
              child.type !== undefined)
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
                className: classNames(columnLinkClass, child.props.className),
              });

              return (
                <li className={columnLinkListItemClass}>{childWithProps}</li>
              );
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
