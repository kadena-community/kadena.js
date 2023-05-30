import { StyledLink } from './styles';

import { IMenuItem, LevelType } from '@/types/Layout';
import React, { FC } from 'react';

interface IItem {
  item: IMenuItem;
  level: LevelType;
}
export const Item: FC<IItem> = ({ item, level }) => (
  <li>
    <StyledLink
      level={`l${level}`}
      href={item.root}
      active={item.isActive}
      data-active={item.isActive}
    >
      {item.label}
    </StyledLink>
  </li>
);
