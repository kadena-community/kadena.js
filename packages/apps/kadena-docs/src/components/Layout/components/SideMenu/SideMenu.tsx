import { Heading, styled } from '@kadena/react-components';

import { MenuCard } from './MenuCard';

import Link from 'next/link';
import React, { FC, useState } from 'react';

const StyledSideMenu = styled('nav', {});

export const SideMenu: FC = () => {
  const [active, setActive] = useState<number>(0);

  return (
    <StyledSideMenu>
      <MenuCard active={active} idx={0}>
        <ul>
          <li>
            <Link onClick={() => setActive(1)} href="/docs/pact">
              Pact
            </Link>
          </li>
          <li>
            <Link onClick={() => setActive(1)} href="/docs/kadenajs">
              KadenaJS
            </Link>
          </li>
        </ul>
      </MenuCard>

      <MenuCard active={active} idx={1}>
        <button onClick={() => setActive(0)}>back</button>
        <Heading as="h6">Kadena Docs</Heading>
        menu
        <p>sdf</p>
        <p>sdf</p>
        <p>sdf</p>
      </MenuCard>
    </StyledSideMenu>
  );
};
