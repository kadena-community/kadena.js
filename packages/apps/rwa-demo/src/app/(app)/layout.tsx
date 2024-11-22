'use client';
import { SideBarLayout } from '@kadena/kode-ui/patterns';

import { AssetForm } from '@/components/AssetSwitch/AssetForm';
import { SupplyCount } from '@/components/SupplyCount/SupplyCount';
import { getAsset } from '@/utils/getAsset';
import { Heading, Link, Stack } from '@kadena/kode-ui';
import React from 'react';
import { KLogo } from './KLogo';
import { SideBar } from './SideBar';

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  if (!getAsset()) {
    return (
      <Stack
        flexDirection="column"
        width="100%"
        alignItems="center"
        justifyContent="center"
        style={{ height: '100dvh' }}
      >
        <div>
          <Heading>Add new asset</Heading>
          <AssetForm />
        </div>
      </Stack>
    );
  }

  return (
    <SideBarLayout
      logo={
        <Link href="/">
          <KLogo height={40} />
        </Link>
      }
      sidebar={<SideBar />}
    >
      <Stack width="100%" flexDirection="column" gap="sm">
        <SupplyCount />
        {children}
      </Stack>
    </SideBarLayout>
  );
};

export default RootLayout;
