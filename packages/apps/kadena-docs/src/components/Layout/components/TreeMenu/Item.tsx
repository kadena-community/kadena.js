import { StyledLink } from './styles';

import { IMenuItem, LevelType } from '@/types/Layout';
import React, { FC } from 'react';

interface IItem {
  item: IMenuItem;
  level: LevelType;
  hasChildren?: boolean;
}
export const Item: FC<IItem> = ({ item, level, hasChildren = false }) => (
  <li>
    <StyledLink
      level={`l${level}`}
      href={item.root}
      active={item.isActive}
      data-active={item.isActive}
    >
      {hasChildren ? item.menu : item.label}
    </StyledLink>
  </li>
);
