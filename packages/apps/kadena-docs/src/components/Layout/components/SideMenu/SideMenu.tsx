import { Heading } from '@kadena/react-components';

import { MainTreeItem } from '../TreeMenu';
import { StyledTreeList } from '../TreeMenu/styles';

import { MenuCard } from './MenuCard';
import {
  SideMenuTitle,
  SideMenuTitleBackButton,
  StyledItem,
  StyledLink,
  StyledSideMenu,
  StyledUl,
} from './styles';
import { useSideMenu } from './useSideMenu';

import { IMenuItem } from '@/types/Layout';
import React, { FC } from 'react';

interface IProps {
  closeMenu: () => void;
  menuItems: IMenuItem[];
}

export const SideMenu: FC<IProps> = ({ closeMenu, menuItems }) => {
  const {
    active,
    menuRef,
    subMenuRef,
    clickMenu,
    clickSubMenu,
    setActive,
    activeItem,
  } = useSideMenu(closeMenu, menuItems);

  const hasSubmenu = Boolean(activeItem?.children.length);

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
      <input type="text" />

      <MenuCard cy="sidemenu-main" active={active} idx={0} ref={menuRef}>
        <StyledUl>
          {menuItems.map((item) => (
            <StyledItem key={item.root}>
              <StyledLink
                onClick={(e) => clickMenu(e, item)}
                href={item.root}
                data-hassubmenu={!!item.children.length}
              >
                {item.menu}
              </StyledLink>
            </StyledItem>
          ))}
        </StyledUl>
      </MenuCard>
      {hasSubmenu && activeItem && (
        <MenuCard
          cy="sidemenu-submenu"
          active={active}
          idx={1}
          ref={subMenuRef}
          onClick={clickSubMenu}
        >
          <StyledTreeList root={true}>
            <MainTreeItem item={activeItem} root={true} />
          </StyledTreeList>
        </MenuCard>
      )}
    </StyledSideMenu>
  );
};
