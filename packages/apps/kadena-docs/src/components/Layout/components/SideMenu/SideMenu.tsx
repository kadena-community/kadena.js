import { Heading, Text } from '@kadena/react-components';

import { MenuCard } from './MenuCard';
import { StyledItem, StyledLink, StyledSideMenu, StyledUl } from './styles';
import { useSideMenu } from './useSideMenu';

import React, { FC } from 'react';

interface IProps {
  closeMenu: () => void;
}

export const SideMenu: FC<IProps> = ({ closeMenu }) => {
  const {
    active,
    menuRef,
    subMenuRef,
    clickMenu,
    clickSubMenu,
    hasSubmenu,
    hasMediumScreen,
    setActive,
    activeTitle,
  } = useSideMenu(closeMenu);

  return (
    <StyledSideMenu>
      <MenuCard active={active} idx={0} ref={menuRef}>
        <Heading as="h5" bold={true}>
          Kadena Docs
        </Heading>
        <StyledUl onClick={clickMenu}>
          <StyledItem>
            <StyledLink href="/docs/pact" data-hassubmenu={true}>
              Pact
            </StyledLink>
          </StyledItem>
          <StyledItem>
            <StyledLink href="/docs/kadenajs" data-hassubmenu={false}>
              KadenaJS
            </StyledLink>
          </StyledItem>
          <StyledItem>
            <StyledLink href="/docs/chainweb" data-hassubmenu={true}>
              Chainweb
            </StyledLink>
          </StyledItem>
        </StyledUl>
      </MenuCard>
      {hasSubmenu && (
        <MenuCard active={active} idx={1} ref={subMenuRef}>
          {!hasMediumScreen && (
            <button onClick={() => setActive(0)}>{activeTitle}</button>
          )}

          <section onClick={clickSubMenu}>
            <Text as="p" bold={true}>
              TODO: fill with the correct menu content
            </Text>

            <StyledLink href="/docs/pact">start</StyledLink>
            <StyledLink href="/docs/pact/how-does-it-work">
              How does it work?
            </StyledLink>
          </section>
        </MenuCard>
      )}
    </StyledSideMenu>
  );
};
