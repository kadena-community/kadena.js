import {
  KadenaLogo,
  NavHeader,
  NavHeaderButton,
  NavHeaderLink,
  NavHeaderLinkList,
  NavHeaderSelect,
  SelectItem,
  Stack,
} from '@kadena/react-ui';
import Link from 'next/link';
import type { FC } from 'react';
import React, { useState } from 'react';
import { GraphQLQueryDialog } from '../graphql-query-dialog/graphql-query-dialog';
import { navbarWrapperClass } from './styles.css';

export const NavBar: FC = () => {
  const [selectedNetwork, setSelectedNetwork] = useState('Mainnet');
  return (
    <Stack className={navbarWrapperClass}>
      <NavHeader
        logo={
          <Link href="/">
            <KadenaLogo height={40} />
          </Link>
        }
      >
        <NavHeaderLinkList>
          <NavHeaderLink>{''}</NavHeaderLink>
          <NavHeaderLink>{''}</NavHeaderLink>
        </NavHeaderLinkList>
        {/* Puting the Query Dialog Component inside a NavHeaderButton was
        causing hydration issues: button inside a button */}
        <GraphQLQueryDialog />
        <NavHeaderSelect
          aria-label="Select Network"
          defaultSelectedKey={selectedNetwork}
          onSelectionChange={(value: any) =>
            setSelectedNetwork(value.toString())
          }
        >
          <SelectItem key={'Mainnet'} textValue="Mainnet">
            Mainnet
          </SelectItem>
          <SelectItem key={'Testnet'} textValue="Testnet">
            Testnet
          </SelectItem>
        </NavHeaderSelect>
      </NavHeader>
    </Stack>
  );
};
