'use client';
import { Analytics } from '@/components/Analytics/Analytics';
import { mediaProviderStyles, Version } from '@kadena/kode-ui';
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
        <Version
          sha={process.env.NEXT_PUBLIC_COMMIT_SHA}
          SSRTime={process.env.NEXT_PUBLIC_BUILD_TIME}
          repo={`https://github.com/kadena-community/kadena.js/tree/${process.env.NEXT_PUBLIC_COMMIT_SHA || 'main'}/packages/apps/rwa-demo`}
        />
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
