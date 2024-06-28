import { SpireKeyKdacolorLogoWhite } from '@kadena/react-icons/product';
import { Button, Select, SelectItem, Stack } from '@kadena/react-ui';
import type { FC, PropsWithChildren } from 'react';
import React, { useState } from 'react';
import { GraphQLQueryDialog } from '../graphql-query-dialog/graphql-query-dialog';
import ThemeToggle from '../theme-toggle/theme-toggle';
import { buttonSizeClass } from './styles.css';

export const NavBar: FC<PropsWithChildren> = ({ children }) => {
  const [selectedNetwork, setSelectedNetwork] = useState('Mainnet');
  return (
    <>
      <Stack>
        <Select
          size="lg"
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
      <Stack flex={1}>{children}</Stack>
      <ThemeToggle />

      <GraphQLQueryDialog />

      <Button
        className={buttonSizeClass}
        variant="primary"
        startVisual={<SpireKeyKdacolorLogoWhite />}
      />
    </>
  );
};
