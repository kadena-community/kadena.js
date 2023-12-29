import type { IMenuItem, LevelType } from '@kadena/docs-tools';
import classNames from 'classnames';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';
import {
  levelItemLinkPseudoVariantClass,
  levelItemVariantClass,
  linkActiveClass,
  linkClass,
  listItemClass,
  listItemVariants,
} from './styles.css';

interface IItem {
  item: IMenuItem;
  level: LevelType;
}
export const Item: FC<IItem> = ({ item, level }) => {
  const classes = classNames(
    linkClass,
    levelItemVariantClass[`l${level}`],
    levelItemLinkPseudoVariantClass[`l${level}`],
    linkActiveClass[item.isActive ? 'true' : 'false'],
  );

  return (
    //TODO: Check with Steven for a good way to do this.
    <li // eslint-disable-next-line react/no-unknown-property
      test-id={`menuItem-${level}`}
      className={classNames(listItemClass, listItemVariants[`l${level}`])}
    >
      <Link className={classes} href={item.root} data-active={item.isActive}>
        {item.label}
      </Link>
    </li>
  );
};
