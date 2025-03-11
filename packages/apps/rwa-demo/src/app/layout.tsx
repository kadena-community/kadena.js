'use client';

import { mediaProviderStyles } from '@kadena/kode-ui';
import React from 'react';

import { Analytics } from '@/components/Analytics/Analytics';
import { Providers } from './Providers';

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
          <Analytics />
          {children}
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
