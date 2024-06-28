import { SpireKeyKdacolorLogoWhite } from '@kadena/react-icons/product';
import { MonoMenu, MonoMenuOpen } from '@kadena/react-icons/system';
import { Button, Select, SelectItem, Stack } from '@kadena/react-ui';
import type { FC, PropsWithChildren } from 'react';
import React, { useState } from 'react';
import { GraphQLQueryDialog } from '../graphql-query-dialog/graphql-query-dialog';
import { Media } from '../layout/media';
import Logo from '../logo/logo';
import MobileLogo from '../logo/mobile-logo';
import ThemeToggle from '../theme-toggle/theme-toggle';
import { buttonSizeClass } from './styles.css';

export const NavBar: FC<
  PropsWithChildren<{
    isFixed?: boolean;
    handleToggleMenu: () => void;
    menuIsOpen?: boolean;
  }>
> = ({ children, isFixed, handleToggleMenu, menuIsOpen }) => {
  const [selectedNetwork, setSelectedNetwork] = useState('Mainnet');
  return (
    <>
      <Stack alignItems="center">
        {isFixed ? (
          <>
            <Media greaterThanOrEqual="md">
              <Logo />
            </Media>
            <Media lessThan="md">
              <MobileLogo />
            </Media>
          </>
        ) : (
          <Media lessThan="md">
            <Logo />
          </Media>
        )}

        <Media greaterThanOrEqual="md">
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
        </Media>
      </Stack>
      <Stack flex={1}>{children}</Stack>

      <Media greaterThanOrEqual="md">
        <Stack>
          <ThemeToggle />
          <GraphQLQueryDialog />

          <Button
            className={buttonSizeClass}
            variant="primary"
            startVisual={<SpireKeyKdacolorLogoWhite />}
          />
        </Stack>
      </Media>
      <Media lessThan="md">
        <Stack>
          <ThemeToggle />

          <Button
            className={buttonSizeClass}
            variant="primary"
            onClick={handleToggleMenu}
            startVisual={menuIsOpen ? <MonoMenuOpen /> : <MonoMenu />}
          />
        </Stack>
      </Media>
    </>
  );
};
