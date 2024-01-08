import { Head, Html, Main, NextScript } from 'next/document';
import type { FC } from 'react';
import React from 'react';
import { bodyStyle } from './styles.css';

const Document: FC = () => {
  return (
    <Html lang="en">
      <Head>
        <meta content="text/html; charset=UTF-8" name="Content-Type" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="msapplication-TileColor" content="#da532c"/>
        <link rel="icon" href="/public/favicon-32x32.png" sizes="32x32" />
        <link rel="icon" href="/public/favicon-16x16.png" sizes="16x16" />
        <link
          rel="shortcut icon"
          sizes="192x192"
          href="/public/android-chrome-192x192.png"
        />
        {/* Android Shortcut icon */}
        <link rel="shortcut icon" href="/public/android-chrome-192x192.png" />
        {/* Apple touch icon */}
        <link rel="apple-touch-icon" href="/public/apple-touch-icon.png" />
      </Head>
      <body className={bodyStyle}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
