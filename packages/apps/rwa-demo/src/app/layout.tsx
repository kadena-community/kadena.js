'use client';
import { Analytics } from '@/components/Analytics/Analytics';
import { mediaProviderStyles } from '@kadena/kode-ui';
import * as Sentry from '@sentry/nextjs';
import React from 'react';
import { Providers } from './Providers';

const MyFallbackComponent = ({ error, componentStack, resetError }) => (
  <div>
    <h2>Something went wrong.</h2>
    <details>
      <summary>Click for error details</summary>
      <pre>{error?.toString()}</pre>
      <pre>{componentStack}</pre>
    </details>
    <button onClick={resetError}>Try again</button>
  </div>
);

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
        <Sentry.ErrorBoundary fallback={MyFallbackComponent} showDialog>
          <Providers>
            {children}
            <Analytics />
          </Providers>
        </Sentry.ErrorBoundary>
      </body>
    </html>
  );
};

export default RootLayout;
