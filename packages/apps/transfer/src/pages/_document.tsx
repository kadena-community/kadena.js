import {
  baseGlobalStyles,
  getCssText,
  globalCss,
} from '@kadena/react-components';

import { Head, Html, Main, NextScript } from 'next/document';
import React, { FC, ReactNode } from 'react';

//@ts-ignore
const globalStyles = globalCss({
  ...baseGlobalStyles,
});

globalStyles();

const Document: FC = () => {
  const TypedHead = Head as unknown as FC<{ children?: ReactNode }>;
  return (
    <Html lang="en">
      <TypedHead>
        <style dangerouslySetInnerHTML={{ __html: getCssText() }}></style>
      </TypedHead>
      <body className="darkTheme">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
