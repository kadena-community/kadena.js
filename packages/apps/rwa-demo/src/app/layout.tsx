'use client';
import { Analytics } from '@/components/Analytics/Analytics';
import { Version } from '@/components/Version/Version';
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
      <body style={{ height: 'auto' }}>
        <Version />
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
