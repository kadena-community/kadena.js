import { Heading, SystemIcon, TextField } from '@kadena/react-ui';

import { MainTreeItem } from '../TreeMenu';
import { StyledTreeList } from '../TreeMenu/styles';

import { MenuCard } from './MenuCard';
import {
  ShowOnMobile,
  SideMenuTitle,
  SideMenuTitleBackButton,
  StyledItem,
  StyledLink,
  StyledSideMenu,
  StyledUl,
} from './styles';
import { useSideMenu } from './useSideMenu';

import { IMenuItem } from '@/types/Layout';
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
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push(`/search?q=${value}`);
      closeMenu();
      e.currentTarget.value = '';
    }
  };

  return (
    <StyledSideMenu>
      {active === 0 && (
        <SideMenuTitle>
          <Heading as="h5">Kadena Docs</Heading>
        </SideMenuTitle>
      )}
      {active === 1 && (
        <>
          <SideMenuTitleBackButton onClick={() => setActive(0)}>
            <Heading as="h5">{activeItem?.menu}</Heading>
          </SideMenuTitleBackButton>
        </>
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
        <StyledUl>
          {menuItems.map((item) => (
            <StyledItem key={item.root}>
              <StyledLink
                onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => clickMenu(e, item)}
                href={item.root}
                data-hassubmenu={!!item.children?.length}
              >
                {item.menu}
              </StyledLink>
            </StyledItem>
          ))}
        </StyledUl>
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
    </StyledSideMenu>
  );
};
