import { Head, Html, Main, NextScript } from 'next/document';
import React, { FC } from 'react';

const Document: FC = () => (
  <Html lang="en">
    <Head />
    <body className="darkTheme">
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
