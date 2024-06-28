import { SpireKeyKdacolorLogoWhite } from '@kadena/react-icons/product';
import { Button, Select, SelectItem, Stack } from '@kadena/react-ui';
import type { FC } from 'react';
import React, { useState } from 'react';
import { GraphQLQueryDialog } from '../graphql-query-dialog/graphql-query-dialog';
import { layoutWrapperClass } from '../layout/styles.css';

import StatisticsComponent from '../statistics-component/statistics-component';
import ThemeToggle from '../theme-toggle/theme-toggle';
import { headerClass } from './styles.css';

const Header: FC = () => {
  const [selectedNetwork, setSelectedNetwork] =
    useState<keyof typeof NetworkTypes>('Mainnet');
  return (
    <Stack as="header" className={layoutWrapperClass}>
      <Stack
        className={headerClass}
        alignItems={'center'}
        width="100%"
        gap="md"
      >
        <Stack>
          <Select
            aria-label="Select network"
            defaultSelectedKey={selectedNetwork}
            fontType="code"
            onSelectionChange={(value) =>
              setSelectedNetwork(value.toString() as keyof typeof NetworkTypes)
            }
          >
            <SelectItem key={'Mainnet'} textValue="Mainnet">
              Mainnet
            </SelectItem>
            <SelectItem key={'Testnet'} textValue="Testnet">
              Testnet
            </SelectItem>
          </Select>
        </Stack>
        <StatisticsComponent />

        <ThemeToggle />

        <GraphQLQueryDialog />

        <Button variant="primary" startVisual={<SpireKeyKdacolorLogoWhite />} />
      </Stack>
      {/* <NavBar /> */}
    </Stack>
  );
};

export default Header;
