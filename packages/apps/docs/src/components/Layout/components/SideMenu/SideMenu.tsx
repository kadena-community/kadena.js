import { Heading, SystemIcon, TextField } from '@kadena/react-ui';

import { MainTreeItem } from '../TreeMenu';
import { StyledTreeList } from '../TreeMenu/styles';

import { ListLink, ShowOnMobile } from './components';
import { MenuCard } from './MenuCard';
import {
  listClass,
  listItemClass,
  sideMenuClass,
  sideMenuTitleButtonClass,
  sideMenuTitleClass,
} from './sideMenu.css';
import { useSideMenu } from './useSideMenu';

import { IMenuItem } from '@/types/Layout';
import { analyticsEvent, EVENT_NAMES } from '@/utils/analytics';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import React, { FC, KeyboardEvent } from 'react';

interface IProps {
  closeMenu: () => void;
  menuItems: IMenuItem[];
}

export const SideMenu: FC<IProps> = ({ closeMenu, menuItems }) => {
  const { active, clickMenu, clickSubMenu, setActive } = useSideMenu(
    closeMenu,
    menuItems,
  );
  const router = useRouter();

  const activeItem = menuItems.find((item) => item.isMenuOpen);

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const value = e.currentTarget.value;
    if (e.key === 'Enter') {
      analyticsEvent(EVENT_NAMES['click:mobile_search'], {
        query: value,
      });
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push(`/search?q=${value}`);
      closeMenu();
      e.currentTarget.value = '';
    }
  };

  return (
    <div className={sideMenuClass}>
      {active === 0 && (
        <div className={sideMenuTitleClass}>
          <Heading as="h5">Kadena Docs</Heading>
        </div>
      )}
      {active === 1 && (
        <button
          type="button"
          onClick={() => setActive(0)}
          className={classNames(sideMenuTitleClass, sideMenuTitleButtonClass)}
        >
          <Heading as="h5">{activeItem?.menu}</Heading>
        </button>
      )}

      <ShowOnMobile>
        <TextField
          inputProps={{
            id: 'search',
            onKeyUp: handleKeyPress,
            placeholder: 'Search',
            leftIcon: SystemIcon.Magnify,
            'aria-label': 'Search',
          }}
        ></TextField>
      </ShowOnMobile>
      <MenuCard cyTestId="sidemenu-main" active={active} idx={0}>
        <ul className={listClass}>
          {menuItems.map((item) => (
            <li key={item.root} className={listItemClass}>
              <ListLink
                onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) =>
                  clickMenu(e, item)
                }
                href={item.root}
                hasSubMenu={!!item.children?.length}
              >
                {item.menu}
              </ListLink>
            </li>
          ))}
        </ul>
      </MenuCard>
      {activeItem && (
        <MenuCard
          cyTestId="sidemenu-submenu"
          active={active}
          idx={1}
          onClick={clickSubMenu}
        >
          <StyledTreeList role="list" root={true}>
            <MainTreeItem item={activeItem} root={true} />
          </StyledTreeList>
        </MenuCard>
      )}
    </div>
  );
};
