import { SpireKeyKdacolorLogoWhite } from '@kadena/react-icons/product';
import { MonoMenu, MonoMenuOpen } from '@kadena/react-icons/system';
import { Button, Stack } from '@kadena/react-ui';
import Link from 'next/link';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { GraphQLQueryDialog } from '../graphql-query-dialog/graphql-query-dialog';
import { Media } from '../layout/media';
import Logo from '../logo/logo';
import MobileLogo from '../logo/mobile-logo';
import SelectNetwork from '../select-network/select-network';
import ThemeToggle from '../theme-toggle/theme-toggle';
import { buttonSizeClass } from './styles.css';

export const NavBar: FC<
  PropsWithChildren<{
    isFixed?: boolean;
    isSearchPage?: boolean;
    handleToggleMenu: () => void;
    menuIsOpen?: boolean;
  }>
> = ({ children, isFixed, isSearchPage, handleToggleMenu, menuIsOpen }) => {
  return (
    <>
      <Stack alignItems="center">
        {isFixed || !isSearchPage ? (
          <>
            <Media greaterThanOrEqual="md">
              <Link href="/">
                <Logo />
              </Link>
            </Media>
            <Media lessThan="md">
              <Link href="/">
                <MobileLogo />
              </Link>
            </Media>
          </>
        ) : (
          <Media lessThan="md">
            <Link href="/">
              <Logo />
            </Link>
          </Media>
        )}

        <Media greaterThanOrEqual="md">
          <SelectNetwork />
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
