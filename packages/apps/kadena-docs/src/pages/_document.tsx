import { getCssText } from '@kadena/react-components';

import { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';

export default function Document(): JSX.Element {
  return (
    <Html>
      <Head>
        <style
          id="stitches"
          dangerouslySetInnerHTML={{ __html: getCssText() }}
        ></style>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
