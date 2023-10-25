import { Head, Html, Main, NextScript } from 'next/document';
import type { FC } from 'react';
import React from 'react';
import { bodyStyle } from './styles.css';

const Document: FC = () => {
  return (
    <Html lang="en">
      <Head />
      <body className={bodyStyle}>
        <Main />
        <div id="modalportal" />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
