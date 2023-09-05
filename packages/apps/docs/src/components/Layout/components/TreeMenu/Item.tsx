import {
  levelItemLinkPseudoVariantClass,
  levelItemVariantClass,
  linkActiveClass,
  linkClass,
} from './styles.css';

import { IMenuItem, LevelType } from '@/types/Layout';
import classnames from 'classnames';
import Link from 'next/link';
import React, { FC } from 'react';

interface IItem {
  item: IMenuItem;
  level: LevelType;
}
export const Item: FC<IItem> = ({ item, level }) => {
  const classes = classnames(
    linkClass,
    levelItemVariantClass[`l${level}`],
    levelItemLinkPseudoVariantClass[`l${level}`],
    linkActiveClass[item.isActive ? 'true' : 'false'],
  );

  return (
    <li>
      <Link className={classes} href={item.root} data-active={item.isActive}>
        {item.label}
      </Link>
    </li>
  );
};
