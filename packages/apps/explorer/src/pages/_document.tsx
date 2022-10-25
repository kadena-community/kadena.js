import { DeferNextScript } from '../services/next';

import Document, { DocumentContext, Head, Html, Main } from 'next/document';
import React from 'react';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    return Document.getInitialProps(ctx);
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/manifest.json" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#3c2453" />
          <meta name="msapplication-TileColor" content="#3c2453" />
          <meta name="theme-color" content="#3c2453" />
        </Head>
        <body style={{ overflowX: 'hidden !important' as 'hidden' }}>
          <Main />
          <DeferNextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
