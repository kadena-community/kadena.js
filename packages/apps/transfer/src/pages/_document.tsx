import { getCssText } from '../config/stitches.config';

import { Head, Html, Main, NextScript } from 'next/document';
import React, { FC, ReactNode } from 'react';

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
