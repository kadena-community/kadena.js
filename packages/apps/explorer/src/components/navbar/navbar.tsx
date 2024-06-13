import { MonoHub } from '@kadena/react-icons/system';
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
import { navbarWrapperClass } from './styles.css';

export const NavBar: FC = () => {
  const [selectedNetwork, setSelectedNetwork] = useState('Mainnet');
  return (
    <Stack className={navbarWrapperClass}>
      <NavHeader
        logo={
          <Link href="">
            <KadenaLogo height={40} />
          </Link>
        }
      >
        <NavHeaderLinkList>
          <NavHeaderLink>{''}</NavHeaderLink>
          <NavHeaderLink>{''}</NavHeaderLink>
        </NavHeaderLinkList>
        <NavHeaderButton variant="transparent" endVisual={<MonoHub />}>
          Graph
        </NavHeaderButton>
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
          <SelectItem key={'Devnet'} textValue="Devnet">
            Testnet
          </SelectItem>
        </NavHeaderSelect>
      </NavHeader>
    </Stack>
  );
};
