import { MenuButton } from './MenuButton';
import {
  gridItemMiniMenuStyle,
  gridMiniMenuListItemStyle,
  gridMiniMenuListStyle,
} from './styles.css';

import { useLayoutContext } from '@/context';
import React, { FC } from 'react';

export interface IMiniMenuProps {}

export const Toolbar: FC<IMiniMenuProps> = () => {
  const { toolbar, setActiveMenuIndex, activeMenuIndex } = useLayoutContext();

  const handleItemClick = (index: number): void => {
    if (toolbar[index]?.items?.length) setActiveMenuIndex(index);
  };

  return (
    <nav className={gridItemMiniMenuStyle}>
      <ul className={gridMiniMenuListStyle}>
        {toolbar.map((item, index) => (
          <li key={String(item.title)} className={gridMiniMenuListItemStyle}>
            <MenuButton
              {...item}
              onClick={() => handleItemClick(index)}
              active={index === activeMenuIndex}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
};
