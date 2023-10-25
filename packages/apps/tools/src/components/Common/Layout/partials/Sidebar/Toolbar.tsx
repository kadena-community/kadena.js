import { useLayoutContext } from '@/context';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import React from 'react';
import { MenuButton } from './MenuButton';
import {
  gridItemMiniMenuStyle,
  gridMiniMenuListItemStyle,
  gridMiniMenuListStyle,
} from './styles.css';

export interface IMiniMenuProps {}

export const Toolbar: FC<IMiniMenuProps> = () => {
  const { toolbar, setActiveMenuIndex, activeMenuIndex } = useLayoutContext();
  const router = useRouter();

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
              active={
                index === activeMenuIndex || item.href === router.pathname
              }
            />
          </li>
        ))}
      </ul>
    </nav>
  );
};
