import { useLayoutContext } from '@/context';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import React from 'react';
import { menuData } from '../../../../../constants/side-menu-items';
import { MenuButton } from './MenuButton';
import {
  bottomIconsContainerStyle,
  gridItemMiniMenuStyle,
  gridMiniMenuListItemStyle,
  gridMiniMenuListStyle,
  iconLeftStyle,
  iconRightStyle,
} from './styles.css';

export interface IMiniMenuProps {}

export const Toolbar: FC<IMiniMenuProps> = () => {
  const { toolbar, setActiveMenuIndex, activeMenuIndex, isMenuOpen } =
    useLayoutContext();
  const router = useRouter();

  const handleItemClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number,
  ): void => {
    if (toolbar[index]?.items?.length) {
      setActiveMenuIndex(index);
    }
  };

  const handleOpenCloseDrawer = (): void => {
    if (isMenuOpen) {
      return setActiveMenuIndex(undefined);
    }

    const mainPath = router.pathname.split('/')[1];
    // @ts-ignore
    const activeMenuIndex = menuData.indexOf(
      menuData.find((item) => item.href.includes(mainPath)),
    );
    setActiveMenuIndex(activeMenuIndex);
  };

  return (
    <nav className={gridItemMiniMenuStyle}>
      <ul className={classNames(gridMiniMenuListStyle)}>
        {toolbar.map((item, index) => (
          <li key={String(item.title)} className={gridMiniMenuListItemStyle}>
            <MenuButton
              {...item}
              onClick={(e) => handleItemClick(e, index)}
              active={
                index === activeMenuIndex || item.href === router.pathname
              }
            />
          </li>
        ))}
      </ul>
      <ul
        className={classNames(gridMiniMenuListStyle, bottomIconsContainerStyle)}
      >
        <li
          key={String('openDrawer')}
          className={classNames(
            gridMiniMenuListItemStyle,
            isMenuOpen ? iconLeftStyle : iconRightStyle,
          )}
        >
          <MenuButton
            title={'Drawer'}
            href={'#'}
            icon={'ArrowExpandUp'}
            onClick={() => handleOpenCloseDrawer()}
          />
        </li>
      </ul>
    </nav>
  );
};
