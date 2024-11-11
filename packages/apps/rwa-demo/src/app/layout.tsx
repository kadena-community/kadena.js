'use client';
import { SideBarLayout } from '@kadena/kode-ui/patterns';

import { Link, mediaProviderStyles } from '@kadena/kode-ui';
import React from 'react';
import { KLogo } from './KLogo';
import { Providers } from './Providers';
import { SideBar } from './SideBar';

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <head>
        <style
          key="fresnel-css"
          dangerouslySetInnerHTML={{ __html: mediaProviderStyles }}
          type="text/css"
        />
      </head>
      <body>
        <Providers>
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
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
