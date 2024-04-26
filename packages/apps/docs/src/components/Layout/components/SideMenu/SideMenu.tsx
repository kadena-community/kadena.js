import { EVENT_NAMES, analyticsEvent } from '@/utils/analytics';
import type { IMenuItem } from '@kadena/docs-tools';
import { Box, SystemIcon, TextField } from '@kadena/react-ui';
import { atoms } from '@kadena/react-ui/styles';
import { useRouter } from 'next/router';
import type { FC, KeyboardEvent } from 'react';
import React from 'react';
import { MainTreeItem } from '../TreeMenu/MainTreeItem';
import { TreeList } from '../TreeMenu/TreeList';
import { MenuCard } from './MenuCard';
import { ShowOnMobile } from './components/ShowOnMobile';
import { sideMenuClass } from './sideMenu.css';
import { useSideMenu } from './useSideMenu';

interface IProps {
  closeMenu: () => void;
  menuItems: IMenuItem[];
}

export const SideMenu: FC<IProps> = ({ closeMenu, menuItems }) => {
  const { active, clickSubMenu, treeRef } = useSideMenu(closeMenu, menuItems);
  const router = useRouter();
  const MagnifierIcon = SystemIcon.Magnify;

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
      <ShowOnMobile>
        <Box marginInline="md" marginBlockStart="md" marginBlockEnd="xl">
          {/* TODO: Replace with SearchField */}
          <TextField
            id="search"
            onKeyUp={handleKeyPress}
            placeholder="Search"
            type="text"
            aria-label="Search"
            endAddon={
              <MagnifierIcon className={atoms({ paddingInline: 'n2' })} />
            }
          />
        </Box>
      </ShowOnMobile>

      <MenuCard
        cyTestId="sidemenu-submenu"
        active={active}
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
