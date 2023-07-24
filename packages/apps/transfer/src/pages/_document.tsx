import {
  baseGlobalStyles,
  getCssText,
  globalCss,
} from '@kadena/react-components';
import { darkThemeClass } from '@kadena/react-ui/theme';

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
      <body>
        <Main />
        <div id="modalportal" />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
