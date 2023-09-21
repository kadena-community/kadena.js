import { Box, Grid, Heading, Stack, Text } from '@kadena/react-ui';

import { BrowseSection, DocsCard } from '@/components';
import { BlogPostsStrip } from '@/components/BlogPostsStrip';
import { docsCardLink } from '@/components/DocsCard/styles.css';
import type { IMenuData } from '@/types/Layout';
import { getBlogPosts } from '@/utils/getBlogPosts';
import {
  checkSubTreeForActive,
  getPathName,
} from '@/utils/staticGeneration/checkSubTreeForActive.mjs';
import type { GetStaticProps } from 'next';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';

interface IProps {
  blogPosts: IMenuData[];
}

const Home: FC<IProps> = ({ blogPosts }) => {
  return (
    <Stack direction="column" gap="$2xl">
      <div>
        <Text>
          <a href="https://www.kadena.io" target="_blank" rel="noreferrer">
            Kadena
          </a>{' '}
          was founded on the idea that blockchain could revolutionize how the
          world interacts and transacts. But to get to mass adoption, chain
          technology and the ecosystem connecting it to the business world
          needed to be reimagined from the ground up. Our founders built a
          proprietary chain architecture and created the tools to make
          blockchain work for business – at speed, scale, and energy efficiency
          previously thought unachievable.&#x20; Don&apos;t forget to follow us
          on{' '}
          <a
            href="ttps://twitter.com/kadena_io"
            target="_blank"
            rel="noreferrer"
          >
            Twitter
          </a>{' '}
          for the latest updates.&#x20;
        </Text>
      </div>

      <Box marginBottom="$20">
        <Grid.Root gap="$lg" columns={{ sm: 1, lg: 2 }}>
          <Grid.Item rowSpan={2}>
            <DocsCard
              label="General"
              description="Learn more about Kadena. What we do, our values and what makes us tick."
              schema="info"
              background="contribute"
            >
              <BrowseSection marker="none">
                <Link className={docsCardLink} href="/docs/kadena/overview">
                  Overview of Kadena
                </Link>
                <Link
                  className={docsCardLink}
                  href="/docs/kadena/code-of-conduct"
                >
                  Code of Conduct
                </Link>
                <a className={docsCardLink} href="https://kadena.io">
                  Kadena.io
                </a>
              </BrowseSection>
            </DocsCard>
          </Grid.Item>
          <Grid.Item>
            <DocsCard
              label="Resources"
              description="Miscellaneous resources to make your Kadena journey easier."
              schema="warning"
              background="marmalade"
            >
              <BrowseSection marker="none">
                <Link
                  className={docsCardLink}
                  href="/docs/kadena/resources/glossary"
                >
                  Glossary
                </Link>
                <Link
                  className={docsCardLink}
                  href="/docs/kadena/resources/press-kit"
                >
                  Press kit
                </Link>
              </BrowseSection>
            </DocsCard>
          </Grid.Item>
          <Grid.Item>
            <DocsCard
              label="Whitepapers"
              description="Read up on the different aspects of Kadena in our whitepapers."
              schema="success"
              background="whitepapers"
            >
              <BrowseSection marker="none">
                <Link
                  className={docsCardLink}
                  href="/docs/kadena/whitepapers/chainweb-layer-1"
                >
                  Chainweb layer 1
                </Link>
                <Link
                  className={docsCardLink}
                  href="/docs/kadena/whitepapers/pact-smart-contract-language"
                >
                  Pact Smart Contract
                </Link>
                <Link
                  className={docsCardLink}
                  href="/docs/kadena/whitepapers/kuro-layer-2"
                >
                  Kuro Layer 2
                </Link>
              </BrowseSection>
            </DocsCard>
          </Grid.Item>
        </Grid.Root>
      </Box>

      <Box>
        <Heading as="h6">Stay up-to-date</Heading>
        <BlogPostsStrip
          data={blogPosts}
          link={`/docs/tags/kadena`}
          linkLabel="More Kadena blogchain..."
        />
      </Box>
    </Stack>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const blogPosts = await getBlogPosts(['kadena']);

  return {
    props: {
      leftMenuTree: checkSubTreeForActive(getPathName(__filename)),
      blogPosts,
      frontmatter: {
        title: 'Intro to Kadena',
        menu: 'Kadena',
        subTitle: 'Build the future on Kadena',
        label: 'Introduction',
        order: 0,
        description: 'Welcome to Kadena&apos;s documentation!',
        layout: 'landing',
        icon: 'KadenaOverview',
      },
    },
  };
};

export default Home;
