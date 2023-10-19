import type { IMenuItem, LevelType } from '@/Layout';
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
    <li className={classNames(listItemClass, listItemVariants[`l${level}`])}>
      <Link className={classes} href={item.root} data-active={item.isActive}>
        {item.label}
      </Link>
    </li>
  );
};
