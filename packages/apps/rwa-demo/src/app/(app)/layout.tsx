'use client';
import { SideBarLayout } from '@kadena/kode-ui/patterns';

import { Link } from '@kadena/kode-ui';
import React from 'react';
import { KLogo } from './KLogo';
import { SideBar } from './SideBar';

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <SideBarLayout
      logo={
        <Link href="/">
          <KLogo height={40} />
        </Link>
      }
      sidebar={<SideBar />}
    >
      {children}
    </SideBarLayout>
  );
};

export default RootLayout;
