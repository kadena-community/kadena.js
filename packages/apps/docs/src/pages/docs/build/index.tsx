import { Box, Grid, Heading, Stack } from '@kadena/react-ui';

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
    <>
      <Box marginBottom="$20">
        <Grid.Root gap="$lg" columns={{ sm: 1, lg: 2 }}>
          <Grid.Item>
            <DocsCard
              label="Quickstart"
              description="Building useful applications on a blockchain doesn’t have to be hard or expensive. This Developer Quickstart is designed to remove the friction from onboarding so that you can understand how to build with Kadena quickly and easily."
              schema="warning"
              background="contribute"
            >
              <BrowseSection marker="none">
                <Link className={docsCardLink} href="/docs/build/quickstart">
                  5 minutes quick start
                </Link>
                <Link
                  className={docsCardLink}
                  href="/docs/build/quickstart/memorywall"
                >
                  Sign the memory wall
                </Link>
                <Link
                  className={docsCardLink}
                  href="/docs/build/quickstart/setup-chainweaver"
                >
                  Setup Chainweaver
                </Link>
                <Link
                  className={docsCardLink}
                  href="/docs/build/quickstart/testnet-account-setup"
                >
                  Testnet account setup
                </Link>
                <Link
                  className={docsCardLink}
                  href="/docs/build/quickstart/pacty-parrots"
                >
                  Pacty Parrots
                </Link>
                <Link
                  className={docsCardLink}
                  href="/docs/build/quickstart/dapp"
                >
                  Build a Dapp
                </Link>
              </BrowseSection>
            </DocsCard>
          </Grid.Item>
          <Grid.Item>
            <DocsCard
              label="Cookbook"
              description="Use the right tools and platforms for building many types of decentralized applications."
              schema="success"
              background="quickstart"
            >
              <BrowseSection marker="none">
                <Link className={docsCardLink} href="/docs/build/cookbook">
                  Pact Language API
                </Link>
                <Link
                  className={docsCardLink}
                  href="/docs/build/cookbook/cookbook"
                >
                  Kadena Client
                </Link>
              </BrowseSection>
            </DocsCard>
          </Grid.Item>
        </Grid.Root>
      </Box>

      <Stack direction="column" gap="$2xl">
        <Box>
          <Heading as="h6">Stay up-to-date</Heading>
          <BlogPostsStrip
            data={blogPosts}
            link={`/docs/tags/kadenajs`}
            linkLabel="More Build blogchain..."
          />
        </Box>
      </Stack>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const blogPosts = await getBlogPosts(['kadenajs', 'cli']);

  return {
    props: {
      blogPosts,
      leftMenuTree: checkSubTreeForActive(getPathName(__filename)),
      frontmatter: {
        title: 'Build on Kadena',
        menu: 'Build',
        subTitle: 'Build your best ideas with us',
        label: 'Introduction',
        order: 1,
        description: 'Build on Kadena',
        layout: 'landing',
        icon: 'Contribute',
      },
    },
  };
};

export default Home;
