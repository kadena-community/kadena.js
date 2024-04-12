import { BlogPostsStrip } from '@/components/BlogPostsStrip/BlogPostsStrip';
import { BrowseSection } from '@/components/BrowseSection/BrowseSection';
import { DocsCard } from '@/components/DocsCard/DocsCard';
import { docsCardLink } from '@/components/DocsCard/styles.css';
import { getPageConfig } from '@/utils/config';
import type { IMenuData } from '@kadena/docs-tools';
import { Box, Grid, GridItem, Heading, Stack } from '@kadena/react-ui';
import type { GetStaticProps } from 'next';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';

interface IProps {
  blogPosts: IMenuData[];
}

const Home: FC<IProps> = ({ blogPosts }) => {
  return (
    <Stack flexDirection="column" gap="xxl">
      <Box marginBlockEnd="xxxl">
        <Grid gap="lg" columns={{ sm: 1, lg: 2 }}>
          <GridItem rowSpan={1}>
            <DocsCard
              label="Engage / Learn"
              description="Start here to learn the basics, including blockchain fundamentals and the core concepts of the Kadena network."
              schema="info"
              background="contribute"
            >
              <BrowseSection marker="none">
                <Link
                  className={docsCardLink}
                  href="/learn/what-is-a-blockchain"
                >
                  What is a blockchain?
                </Link>

                <Link className={docsCardLink} href="/learn/why-build">
                  Why build on a blockchain?
                </Link>

                <Link className={docsCardLink} href="/learn/why-kadena">
                  Why Kadena?
                </Link>

                <Link className={docsCardLink} href="/learn/cryptography">
                  What we mean when we say crypto
                </Link>

                <Link className={docsCardLink} href="/learn/consensus">
                  Consensus concisely
                </Link>
              </BrowseSection>
            </DocsCard>
          </GridItem>

          <GridItem>
            <DocsCard
              label="Onboard / Build"
              description="Try Kadena as a first time user or start your journey as a developer with a guided tour."
              schema="warning"
              background="marmalade"
            >
              <BrowseSection marker="none">
                <Link className={docsCardLink} href="/build/onboard">
                  Explore the blockchain
                </Link>
                <Link className={docsCardLink} href="/build/quickstart">
                  Deploy your first contract - Quick start
                </Link>
                <Link className={docsCardLink} href="/build/pact">
                  Get started with Pact smart contract language
                </Link>
              </BrowseSection>
            </DocsCard>
          </GridItem>

          <GridItem>
            <DocsCard
              label="Coach / Build"
              description="Take your game to the next level with tools, sample code, and 
              how-to guides."
              schema="success"
              background="whitepapers"
            >
              <BrowseSection marker="none">
                <Link className={docsCardLink} href="/build/pact">
                  Smart contracts
                </Link>
                <Link className={docsCardLink} href="/build/frontend">
                  Frontend libraries
                </Link>
                <Link className={docsCardLink} href="/build/templates">
                  Code templates
                </Link>
                <Link className={docsCardLink} href="/build/nft-marmalade">
                  Non-fungible tokens
                </Link>
              </BrowseSection>
            </DocsCard>
          </GridItem>

          <GridItem>
            <DocsCard
              label="Propel / Deploy / Get technical"
              description="Deploy your smart contracts on the network or support the infrastructure by deploying a Chainweb node."
              schema="success"
              background="whitepapers"
            >
              <BrowseSection marker="none">
                <Link className={docsCardLink} href="/deploy">
                  Prepare to deploy
                </Link>
                <Link
                  className={docsCardLink}
                  href="/deploy/chainweb-get-started"
                >
                  Get started as a Chainweb node operator
                </Link>

                <Link
                  className={docsCardLink}
                  href="https://www.kadena.io/chainweb"
                >
                  Chainweb consensus protocol
                </Link>
                <Link
                  className={docsCardLink}
                  href="https://www.kadena.io/pact"
                >
                  Pact smart contract language
                </Link>
              </BrowseSection>
            </DocsCard>
          </GridItem>

          <GridItem rowSpan={1}>
            <DocsCard
              label="Embrace / Participate / Join us"
              description="Find out about community programs, grants, partnerships, and business development opportunities,
              to grow the Kadena ecosystem and how you can contribute."
              schema="info"
              background="contribute"
            >
              <BrowseSection marker="none">
                <Link className={docsCardLink} href="/participate">
                  How to get involved
                </Link>

                <Link className={docsCardLink} href="/participate/community">
                  Community programs
                </Link>

                <Link className={docsCardLink} href="/participate/developers">
                  Developer programs
                </Link>

                <Link className={docsCardLink} href="/participate/docs">
                  Contribute to doc
                </Link>

                <Link className={docsCardLink} href="https://kadena.io/grants/">
                  Grants
                </Link>
              </BrowseSection>
            </DocsCard>
          </GridItem>

          <GridItem>
            <DocsCard
              label="Explore / Go beyond"
              description="Explore videos, whitepapers, discussion forums, and other sites and tools that are outside the scope of documentation."
              schema="warning"
              background="marmalade"
            >
              <BrowseSection marker="none">
                <Link className={docsCardLink} href="https://tools.kadena.io">
                  Get KDA and developer tools
                </Link>
                <Link className={docsCardLink} href="https://academy.kadena.io">
                  Browse courses in the Kadena Academy
                </Link>
                <Link
                  className={docsCardLink}
                  href="https://www.youtube.com/kadenablockchain"
                >
                  Visit the Kadena video library
                </Link>
                <Link
                  className={docsCardLink}
                  href="https://www.kadena.io/blog"
                >
                  Stay up to date
                </Link>
              </BrowseSection>
            </DocsCard>
          </GridItem>
        </Grid>
      </Box>
    </Stack>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      ...(await getPageConfig({
        blogPosts: ['kadena'],
        filename: __filename,
      })),

      frontmatter: {
        title: 'Welcome to Kadena',
        menu: 'Kadena',
        subTitle: 'Build the future on Kadena',
        label: 'Introduction',
        order: 0,
        description: 'Welcome to Kadena&apos;s documentation!',
        layout: 'landing',
      },
    },
  };
};

export default Home;
