import { EVENT_NAMES, analyticsEvent } from '@/utils/analytics';
import type { IMenuItem } from '@kadena/docs-tools';
import { Box, Heading, SystemIcon, TextField } from '@kadena/react-ui';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import type { FC, FormEvent } from 'react';
import React from 'react';
import { MainTreeItem } from '../TreeMenu/MainTreeItem';
import { TreeList } from '../TreeMenu/TreeList';
import { MenuCard } from './MenuCard';
import { ListLink } from './components/ListLink';
import { ShowOnMobile } from './components/ShowOnMobile';
import {
  listClass,
  listItemClass,
  searchButtonClass,
  sideMenuClass,
  sideMenuTitleButtonClass,
  sideMenuTitleClass,
} from './sideMenu.css';
import { useSideMenu } from './useSideMenu';

interface IProps {
  closeMenu: () => void;
  menuItems: IMenuItem[];
}

export const SideMenu: FC<IProps> = ({ closeMenu, menuItems }) => {
  const { active, clickMenu, clickSubMenu, setActive, treeRef } = useSideMenu(
    closeMenu,
    menuItems,
  );
  const router = useRouter();
  const MagnifierIcon = SystemIcon.Magnify;

  const activeItem = menuItems.find((item) => item.isMenuOpen);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const value = `${data.get('search')}`;
    analyticsEvent(EVENT_NAMES['click:mobile_search'], {
      query: value,
    });
    e.currentTarget.value = '';
    await router.push(`/search?q=${value}`);
    closeMenu();
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
        <Box marginInline="md" marginBlockStart="md" marginBlockEnd="xl">
          {/* TODO: Replace with SearchField */}
          <form onSubmit={handleSubmit}>
            <TextField
              id="search"
              name="search"
              placeholder="Search"
              type="text"
              aria-label="Search"
              endAddon={
                <button type="submit" className={searchButtonClass}>
                  <MagnifierIcon />
                </button>
              }
            />
          </form>
        </Box>
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
          <TreeList ref={treeRef} root={true}>
            <MainTreeItem item={activeItem} root={true} />
          </TreeList>
        </MenuCard>
      )}
    </div>
  );
};
