import { baseGlobalStyles, globalCss } from '@kadena/react-components';

import { Footer,Header } from '@/components/Layout/components';
import { getLayout } from '@/utils';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import React, { ComponentType } from 'react';

const GlobalStyles = globalCss({
  ...baseGlobalStyles,
  body: {
    background: '$background',
  },
});
GlobalStyles();

// eslint-disable-next-line @typescript-eslint/naming-convention
export default function App({ Component, pageProps }: AppProps): JSX.Element {
  const { markdoc } = pageProps;

  let title, description;
  let layoutType = 'default';
  if (markdoc !== undefined) {
    title = markdoc.frontmatter.title;
    description = markdoc.frontmatter.description;
    layoutType = markdoc.frontmatter.layout ?? 'default';
  }

  const Layout = getLayout(layoutType);

  // Fixes "Component' cannot be used as a JSX component."
  const ReactComponent = Component as ComponentType;
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />
      </Head>
      <Header />
      <Layout>
        <ReactComponent {...pageProps} />
      </Layout>
      <Footer/>
    </>
  );
}
