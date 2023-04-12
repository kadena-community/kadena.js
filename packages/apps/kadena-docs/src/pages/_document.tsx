import { getCssText } from '@kadena/react-components';

import { Head, Html, Main, NextScript } from 'next/document';
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
        <TypedNextScript />
      </body>
    </Html>
  );
}
