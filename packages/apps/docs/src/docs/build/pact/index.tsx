import type { IMostPopularPage } from '@/MostPopularData';
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
import {
  extraMarginSmallWrapper,
  extraMarginWrapper,
} from '@/styles/index.css';
import { getPageConfig } from '@/utils/config';
import type { IMenuData } from '@kadena/docs-tools';
import {
  Box,
  Card,
  Grid,
  GridItem,
  Heading,
  Link as KadenaLink,
  SystemIcon,
  Text,
} from '@kadena/react-ui';
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
        <Grid gap="lg" columns={{ sm: 1, lg: 2 }}>
          <GridItem>
            <Card fullWidth>
              <Heading as="h4">Learn Pact</Heading>
              <Box marginBlock="md">
                <Text>
                  Pact allows anyone to write clearly, directly and safely onto
                  a blockchain — a true innovation for secure and simple smart
                  contract development. Pact will enable you to create entirely
                  new business models and on-chain services. Learn the basics of
                  Pact to create a smart contract
                </Text>
              </Box>
              <KadenaLink
                endIcon={<SystemIcon.TrailingIcon />}
                href="/pact/beginner"
                variant="contained"
              >
                Getting started
              </KadenaLink>
            </Card>
          </GridItem>
          <GridItem>
            <Box
              className={extraMarginWrapper}
              marginInlineStart={{ sm: 'no', lg: 'md' }}
            >
              <MostPopular
                pages={popularPages}
                title="Most viewed docs"
                titleAs="h6"
              />
            </Box>
          </GridItem>
        </Grid>

        <Box className={extraMarginSmallWrapper}>
          <Grid gap="lg" columns={{ sm: 1, lg: 2 }}>
            <GridItem rowSpan={2}>
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
            </GridItem>
            <GridItem>
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
            </GridItem>
            <GridItem>
              <DocsCard
                label="Whitepaper"
                description="Pact is the programming language for writing smart contracts to be executed by the Kadena blockchain."
                schema="success"
                background="whitepapers"
              >
                <BrowseSection marker="none">
                  <Link
                    className={docsCardLink}
                    href="https://www.kadena.io/whitepapers"
                  >
                    Read the whitepaper
                  </Link>
                </BrowseSection>
              </DocsCard>
            </GridItem>
          </Grid>
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
  return {
    props: {
      ...(await getPageConfig({
        blogPosts: ['pact'],
        popularPages: '/pact',
        filename: __filename,
      })),
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
