import { Heading, Text } from '@kadena/react-components';

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
            <Heading as="h5">{activeItem?.label}</Heading>
          </SideMenuTitleBackButton>
        </>
      )}
      <input type="text" />

      <MenuCard active={active} idx={0} ref={menuRef}>
        <StyledUl>
          {menuItems.map((item) => (
            <StyledItem key={item.label}>
              <StyledLink
                onClick={() => clickMenu(item)}
                href={item.root}
                data-hassubmenu={!!item.children.length}
              >
                {item.label}
              </StyledLink>
            </StyledItem>
          ))}
        </StyledUl>
      </MenuCard>
      {hasSubmenu && (
        <MenuCard active={active} idx={1} ref={subMenuRef}>
          <section onClick={clickSubMenu}>
            <Text as="p" bold={true}>
              TODO: fill with the correct menu content
            </Text>

            {activeItem?.children.map((item) => (
              <StyledLink key={item.label} href={item.root}>
                {item.label}
              </StyledLink>
            ))}
          </section>
        </MenuCard>
      )}
    </StyledSideMenu>
  );
};
