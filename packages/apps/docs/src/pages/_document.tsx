import { Head, Html, Main, NextScript } from 'next/document';
import type { ComponentType, FC, ReactNode } from 'react';
import React from 'react';

const Document = (): JSX.Element => {
  const TypedHead = Head as unknown as FC<{ children?: ReactNode }>;
  const TypedNextScript = NextScript as ComponentType;
  return (
    <Html lang="en">
      <TypedHead></TypedHead>
      <body>
        <Main />
        <div id="modalportal" />
        <TypedNextScript />
      </body>
    </Html>
  );
};

export default Document;
