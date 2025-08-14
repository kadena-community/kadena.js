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
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Kadena.js RWA Demo</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta name="description" content="Kadena.js RWA Demo Application" />
        <meta content="text/html; charset=UTF-8" name="Content-Type" />
        <meta content="#020E1B" name="theme-color" />
        <link rel="icon" href="/assets/favicons/icon@32.png?1" sizes="32x32" />
        <link
          rel="icon"
          href="/assets/favicons/icon@128.png?1"
          sizes="128x128"
        />
        <link
          rel="shortcut icon"
          sizes="192x192"
          href="/assets/favicons/icon@192.png?1"
        />
        {/* Android Shortcut icon */}
        <link rel="shortcut icon" href="/assets/favicons/icon@192.png?1" />
        {/* Apple touch icon */}
        <link rel="apple-touch-icon" href="/assets/favicons/icon@192.png?1" />
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
          <>{children}</>
          <Analytics />
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
