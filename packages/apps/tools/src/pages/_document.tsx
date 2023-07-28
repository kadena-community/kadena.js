import { Head, Html, Main, NextScript } from 'next/document';
import React, { FC, ReactNode } from 'react';
import { bodyStyle } from './styles.css';

const Document: FC = () => {
  const TypedHead = Head as unknown as FC<{ children?: ReactNode }>;
  return (
    <Html lang="en">
      <TypedHead></TypedHead>
      <body className={bodyStyle}>
        <Main />
        <div id="modalportal" />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
