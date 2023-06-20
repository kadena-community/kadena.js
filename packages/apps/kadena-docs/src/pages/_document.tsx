import { getCssText } from '@kadena/react-components';

import { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';
import React, { ComponentType, FC, ReactNode } from 'react';

export default function Document(): JSX.Element {
  // Fixes "Component' cannot be used as a JSX component."
  const TypedHead = Head as unknown as FC<{ children?: ReactNode }>;
  const TypedNextScript = NextScript as ComponentType;
  return (
    <Html>
      <TypedHead>
        <style
          id="stitches"
          dangerouslySetInnerHTML={{ __html: getCssText() }}
        ></style>
      </TypedHead>
      <body>
        <Main />
        <div id="modalportal" />
        <TypedNextScript />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('consent', 'default', {
            'analytics_storage': 'denied'
        });

          gtag('config', '${process.env.NEXT_PUBLIC_TRACKING_ID}');
        `}
        </Script>
      </body>
    </Html>
  );
}
