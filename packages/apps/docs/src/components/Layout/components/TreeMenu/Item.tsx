import {
  levelItemLinkPseudoVariantClass,
  levelItemVariantClass,
  styledLinkActiveClass,
  styledLinkClass,
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
    styledLinkClass,
    levelItemVariantClass[`l${level}`],
    levelItemLinkPseudoVariantClass[`l${level}`],
    styledLinkActiveClass[item.isActive ? 'true' : 'false'],
  );

  return (
    <li>
      <Link className={classes} href={item.root} data-active={item.isActive}>
        {item.label}
      </Link>
    </li>
  );
};
