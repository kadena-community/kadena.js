import { Box, Button, Card, Grid, Heading, Text } from '@kadena/react-ui';

import { BlogPostsStrip } from '@/components/BlogPostsStrip/BlogPostsStrip';
import { BrowseSection } from '@/components/BrowseSection/BrowseSection';
import { DocsCard } from '@/components/DocsCard/DocsCard';
import { docsCardLink } from '@/components/DocsCard/styles.css';
import {
  articleClass,
  contentClass,
  contentClassVariants,
} from '@/components/Layout/components/articleStyles.css';
import MostPopular from '@/components/MostPopular/MostPopular';
import type { IMenuData } from '@/Layout';
import type { IMostPopularPage } from '@/MostPopularData';
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
          <Text>
            Pact allows anyone to write clearly, directly and safely onto a
            blockchain — a true innovation for secure and simple smart contract
            development. Pact will enable you to create entirely new business
            models and on-chain services.
          </Text>
        </Box>

        <Grid.Root gap="$lg" columns={{ sm: 1, lg: 2 }}>
          <Grid.Item>
            <Card>
              <Heading as="h4">Learn Pact</Heading>
              <Box marginY="$4">
                <Text>Learn the basics of Pact to create a smart contract</Text>
              </Box>
              <Button as="a" asChild icon="TrailingIcon">
                <Link href={'/pact/beginner'}>Getting started</Link>
              </Button>
            </Card>
          </Grid.Item>
          <Grid.Item>
            <Box
              marginTop="$8"
              marginLeft={{ sm: 0, lg: '$4' }}
              marginRight={{ sm: 0, xl: '$32' }}
            >
              <MostPopular pages={popularPages} title="Most viewed docs" />
            </Box>
          </Grid.Item>
        </Grid.Root>

        <Box marginBottom="$20">
          <Grid.Root gap="$lg" columns={{ sm: 1, lg: 2 }}>
            <Grid.Item rowSpan={2}>
              <DocsCard
                label="Introduction"
                description="Pact is a human-readable smart contract language. It allows anyone to write clearly, directly and safely onto a blockchain — a true innovation for secure and simple smart contract development. Pact will enable you to create entirely new business models and on-chain services."
                schema="info"
                background="smartwallet"
              >
                <BrowseSection marker="none">
                  <Link className={docsCardLink} href="/pact/overview">
                    What is Pact?
                  </Link>
                  <Link className={docsCardLink} href="/pact/reference/pacts">
                    What are Pacts?
                  </Link>
                  <Link className={docsCardLink} href="/pact/reference">
                    Language Reference
                  </Link>
                  <Link className={docsCardLink} href="/pact/api">
                    Open API
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
                  <Link className={docsCardLink} href="/pact/beginner">
                    Beginner tutorials
                  </Link>
                  <Link className={docsCardLink} href="/pact/intermediate">
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
                    href="/kadena/whitepapers/pact-smart-contract-language"
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
          link={`/tags/pact`}
          linkLabel="More Pact blogchain..."
        />
      </article>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const mostPopularPages = await getMostPopularPages('/pact');
  const blogPosts = await getBlogPosts(['pact']);

  return {
    props: {
      popularPages: mostPopularPages,
      blogPosts,
      leftMenuTree: checkSubTreeForActive(getPathName(__filename)),
      frontmatter: {
        title: 'Learn Pact',
        subTitle: 'The human-readable smart contract language',
        menu: 'Pact',
        label: 'Pact',
        order: 2,
        description: 'The human-readable smart contract language',
        layout: 'landing',
      },
    },
  };
};

export default Home;
