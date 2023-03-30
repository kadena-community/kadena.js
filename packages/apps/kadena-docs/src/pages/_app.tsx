import type { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import type { MarkdocNextJsPageProps } from '@markdoc/next.js';
import { getLayout } from '@/utils/getLayout';
import { globalCss, baseGlobalStyles } from '@kadena/react-components';

const GlobalStyles = globalCss({
  ...baseGlobalStyles,
  body: {
    background: '$background',
  },
});
GlobalStyles();

export type MyAppProps = MarkdocNextJsPageProps;
export default function App({
  Component,
  pageProps,
}: AppProps<MyAppProps>): JSX.Element {
  const { markdoc } = pageProps;

  let title, description;
  let layoutType = 'default';
  if (markdoc) {
    title = markdoc.frontmatter.title;
    description = markdoc.frontmatter.description;
    layoutType = markdoc.frontmatter.layout ?? 'default';
  }

  const Layout = getLayout(layoutType);

  const AnyComponent = Component as any;
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />
      </Head>
      <Layout>
        <AnyComponent {...pageProps} />
      </Layout>
    </>
  );
}
