import {
  Box,
  Button,
  Card,
  Grid,
  Heading,
  Stack,
  Text,
} from '@kadena/react-ui';

import { BrowseSection, DocsCard, MostPopular } from '@/components';
import { BlogPostsStrip } from '@/components/BlogPostsStrip';
import { docsCardLink } from '@/components/DocsCard/styles.css';
import {
  articleClass,
  contentClass,
  contentClassVariants,
} from '@/components/Layout/components';
import type { IMenuData } from '@/types/Layout';
import type { IMostPopularPage } from '@/types/MostPopularData';
import { getBlogPosts } from '@/utils/getBlogPosts';
import getMostPopularPages from '@/utils/getMostPopularPages';
import {
  checkSubTreeForActive,
  getPathName,
} from '@/utils/staticGeneration/checkSubTreeForActive.mjs';
import classNames from 'classnames';
import type { GetStaticProps } from 'next';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';

interface IProps {
  popularPages: IMostPopularPage[];
  blogPosts: IMenuData[];
}

const Home: FC<IProps> = ({ popularPages, blogPosts }) => {
  return (
    <div
      className={classNames(contentClass, contentClassVariants.home)}
      id="main"
    >
      <article className={articleClass}>
        <Box marginRight={{ sm: 0, lg: '$32', xl: '$64' }} marginBottom="$10">
          <Heading as="h4">The human-readable smart contract language</Heading>
          <Text>
            Pact allows anyone to write clearly, directly and safely onto a
            blockchain — a true innovation for secure and simple smart contract
            development. Pact will enable you to create entirely new business
            models and on-chain services.
          </Text>
        </Box>

        <Stack
          justifyContent="space-between"
          direction={{ sm: 'column', lg: 'row' }}
        >
          <Card>
            <Heading as="h4">Learn Pact</Heading>
            <Box marginY="$4">
              <Text>Learn the basics of Pact to create a smart contract</Text>
            </Box>
            <Button as="a" asChild icon="TrailingIcon">
              <Link href={'/docs/pact/beginner'}>Getting started</Link>
            </Button>
          </Card>
          <Box
            marginTop="$8"
            marginLeft={{ sm: 0, lg: '$4' }}
            marginRight={{ sm: 0, xl: '$32' }}
          >
            <MostPopular pages={popularPages} title="Most viewed docs" />
          </Box>
        </Stack>

        <Box marginBottom="$20">
          <Grid.Root gap="$lg" columns={{ sm: 1, lg: 2 }}>
            <Grid.Item rowSpan={2}>
              <DocsCard
                label="Language reference"
                description="Reference for the Pact smart-contract language, designed for correct, transactional execution on a high-perdormance blockchain."
                schema="info"
                background="smartwallet"
              >
                <BrowseSection marker="none">
                  <Link className={docsCardLink} href="/docs/kadena/overview">
                    Introduction
                  </Link>
                  <Link
                    className={docsCardLink}
                    href="/docs/pact/reference/rest-api"
                  >
                    REST API&apos;s
                  </Link>
                  <Link
                    className={docsCardLink}
                    href="/docs/pact/reference/concepts"
                  >
                    Concepts
                  </Link>
                  <Link
                    className={docsCardLink}
                    href="/docs/pact/reference/syntax"
                  >
                    Syntax
                  </Link>
                  <Link
                    className={docsCardLink}
                    href="/docs/pact/reference/time-formats"
                  >
                    Time Formats
                  </Link>
                  <Link
                    className={docsCardLink}
                    href="/docs/pact/reference/functions"
                  >
                    Built-in functions
                  </Link>
                  <Link
                    className={docsCardLink}
                    href="/docs/pact/reference/property-checking"
                  >
                    Property Checking System
                  </Link>
                  <Link
                    className={docsCardLink}
                    href="/docs/pact/reference/properties-and-invariants"
                  >
                    Property and Invariant Functions
                  </Link>
                </BrowseSection>
              </DocsCard>
            </Grid.Item>
            <Grid.Item>
              <DocsCard
                label="Tutorials"
                description="Start learning Pact and how to implement it."
                schema="warning"
                background="react"
              >
                <BrowseSection marker="none">
                  <Link className={docsCardLink} href="/docs/pact/beginner">
                    Beginner tutorials
                  </Link>
                  <Link className={docsCardLink} href="/docs/pact/intermediate">
                    Intermediate tutorials
                  </Link>
                </BrowseSection>
              </DocsCard>
            </Grid.Item>
            <Grid.Item>
              <DocsCard
                label="Whitepaper"
                description="Pact is the programming language for writing smart contracts to be executed by the Kadena blockchain."
                schema="success"
                background="whitepapers"
              >
                <BrowseSection marker="none">
                  <Link
                    className={docsCardLink}
                    href="/docs/kadena/wallets/chainweaver"
                  >
                    Read the whitepaper
                  </Link>
                </BrowseSection>
              </DocsCard>
            </Grid.Item>
          </Grid.Root>
        </Box>

        <Heading as="h6">Stay up-to-date</Heading>
        <BlogPostsStrip
          data={blogPosts}
          link={`/docs/tags/pact`}
          linkLabel="More Pact blogchain..."
        />
      </article>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const mostPopularPages = await getMostPopularPages('/docs/pact');
  const blogPosts = await getBlogPosts(['pact']);

  return {
    props: {
      popularPages: mostPopularPages,
      blogPosts,
      leftMenuTree: checkSubTreeForActive(getPathName(__filename)),
      frontmatter: {
        title: 'Learn Pact',
        menu: 'Pact',
        label: 'Pact',
        order: 3,
        description: 'Kadena makes blockchain work for everyone.',
        layout: 'landing',
        icon: 'PactLanguage',
      },
    },
  };
};

export default Home;
