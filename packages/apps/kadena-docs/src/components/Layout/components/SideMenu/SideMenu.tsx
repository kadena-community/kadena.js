import { Heading, styled, StyledComponent } from '@kadena/react-components';

import { MenuCard } from './MenuCard';

import Link from 'next/link';
import React, { FC, MouseEventHandler, useRef, useState } from 'react';

const StyledSideMenu = styled('nav', {
  position: 'relative',
  marginTop: '$6',
});

const StyledUl: StyledComponent<'ul'> = styled('ul', {
  listStyle: 'none',
  padding: 0,
});

const StyledItem: StyledComponent<'li'> = styled('li', {
  borderBottom: '1px solid $borderColor',
  padding: '$4 0 $2',
});

const StyledLink: StyledComponent<typeof Link> = styled(Link, {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  color: '$neutral4',
  fontWeight: '$semiBold',
  textDecoration: 'none',
  '&::after': {
    position: 'absolute',
    right: '$2',
    content: '',
    width: '$2',
    height: '$2',
    borderRight: '2px solid $neutral4',
    borderTop: '2px solid $neutral4',
    opacity: 0,
    transform: 'rotate(45deg) translate(-5px, 5px)',
    transition: 'transform .2s ease ',
  },
  '&:hover': {
    color: '$primarySurfaceInverted',

    '&::after': {
      opacity: 1,
      transform: 'rotate(45deg) translate(0px, 0px)',
    },
  },
});

export const SideMenu: FC = () => {
  const [active, setActive] = useState<number>(0);
  const [activeTitle, setActiveTitle] = useState<string>('');
  const menuRef = useRef<HTMLUListElement>(null);

  const clickMenu: MouseEventHandler<HTMLUListElement> = (e) => {
    const clickedItem = e.target as HTMLAnchorElement;
    console.log(clickedItem.innerHTML);
    setActiveTitle(clickedItem.innerHTML);
  };

  return (
    <StyledSideMenu>
      <MenuCard active={active} idx={0}>
        <Heading as="h5" bold={true}>
          Kadena Docs
        </Heading>
        <StyledUl ref={menuRef} onClick={clickMenu}>
          <StyledItem>
            <StyledLink onClick={() => setActive(1)} href="/docs/pact">
              Pact
            </StyledLink>
          </StyledItem>
          <StyledItem>
            <StyledLink onClick={() => setActive(1)} href="/docs/kadenajs">
              KadenaJS
            </StyledLink>
          </StyledItem>
        </StyledUl>
      </MenuCard>

      <MenuCard active={active} idx={1}>
        <button onClick={() => setActive(0)}>{activeTitle}</button>
        <Heading as="h6">Kadena Docs</Heading>
        menu
        <p>sdf</p>
        <p>sdf</p>
        <p>sdf</p>
      </MenuCard>
    </StyledSideMenu>
  );
};
