import { Link } from '@/components/Routing/Link';
import { Stack } from '@kadena/kode-ui';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { GraphQLQueryDialog } from '../GraphqlQueryDialog/GraphqlQueryDialog';
import { Media } from '../Layout/media';
import { Logo } from '../Logo/Logo';
import { MobileLogo } from '../Logo/MobileLogo';
import { SelectNetwork } from '../SelectNetwork/SelectNetwork';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';

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

      <Stack alignItems="center">
        <Media lessThan="md">
          <SelectNetwork />
        </Media>
        <ThemeToggle />
        <GraphQLQueryDialog />
      </Stack>
    </>
  );
};
