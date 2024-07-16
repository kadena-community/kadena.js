import Link from '@/components/routing/link';
import { Stack } from '@kadena/kode-ui';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { GraphQLQueryDialog } from '../graphql-query-dialog/graphql-query-dialog';
import { Media } from '../layout/media';
import Logo from '../logo/logo';
import MobileLogo from '../logo/mobile-logo';
import SelectNetwork from '../select-network/select-network';
import ThemeToggle from '../theme-toggle/theme-toggle';

export const NavBar: FC<
  PropsWithChildren<{
    isFixed?: boolean;
    isSearchPage?: boolean;
  }>
> = ({ children, isFixed, isSearchPage }) => {
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

      <Stack>
        <ThemeToggle />
        <GraphQLQueryDialog />
      </Stack>
    </>
  );
};
