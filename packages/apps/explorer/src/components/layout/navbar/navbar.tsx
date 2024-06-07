import { MonoHub } from '@kadena/react-icons/system';
import {
  KadenaLogo,
  NavHeader,
  NavHeaderButton,
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
        <NavHeaderButton variant="transparent" endVisual={<MonoHub />}>
          Graph
        </NavHeaderButton>
        <NavHeaderSelect
          aria-label="Select Network"
          defaultSelectedKey={selectedNetwork}
          onSelectionChange={(value: string) => setSelectedNetwork(value)}
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
