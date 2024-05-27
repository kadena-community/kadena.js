import { EVENT_NAMES, analyticsEvent } from '@/utils/analytics';
import type { IMenuItem } from '@kadena/docs-tools';
import { MonoSearch } from '@kadena/react-icons';
import { Box, TextField } from '@kadena/react-ui';

import { useRouter } from 'next/router';
import type { FC, FormEvent } from 'react';
import React, { useRef } from 'react';
import { MainTreeItem } from '../TreeMenu/MainTreeItem';
import { TreeList } from '../TreeMenu/TreeList';
import { MenuCard } from './MenuCard';
import { ShowOnMobile } from './components/ShowOnMobile';

import { searchButtonClass, sideMenuClass } from './sideMenu.css';
import { useSideMenu } from './useSideMenu';

interface IProps {
  closeMenu: () => void;
  menuItems: IMenuItem[];
}

export const SideMenu: FC<IProps> = ({ closeMenu, menuItems }) => {
  const { clickSubMenu, treeRef } = useSideMenu(closeMenu, menuItems);
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);

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
      <ShowOnMobile>
        <Box marginInline="md" marginBlockStart="md" marginBlockEnd="xl">
          {/* TODO: Replace with SearchField */}
          <form onSubmit={handleSubmit}>
            <TextField
              id="search"
              ref={searchRef}
              name="search"
              placeholder="Search"
              type="text"
              aria-label="Search"
              endAddon={
                <button
                  type="submit"
                  className={searchButtonClass}
                  aria-label="Click to Search"
                >
                  <MonoSearch />
                </button>
              }
            />
          </form>
        </Box>
      </ShowOnMobile>

      <MenuCard
        cyTestId="sidemenu-submenu"
        active={1}
        idx={1}
        onClick={clickSubMenu}
      >
        <TreeList ref={treeRef} root={true} level="l0">
          {menuItems.map((menu) => (
            <MainTreeItem key={menu.root} item={menu} root={false} level={0} />
          ))}
        </TreeList>
      </MenuCard>
    </div>
  );
};
