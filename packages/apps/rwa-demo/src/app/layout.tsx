'use client';

import { mediaProviderStyles } from '@kadena/kode-ui';
import React from 'react';

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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
