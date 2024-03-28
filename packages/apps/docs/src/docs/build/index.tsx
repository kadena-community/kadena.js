import type { IMostPopularPage } from '@/MostPopularData';
import { BlogPostsStrip } from '@/components/BlogPostsStrip/BlogPostsStrip';
import { BrowseSection } from '@/components/BrowseSection/BrowseSection';
import { DocsCard } from '@/components/DocsCard/DocsCard';
import { docsCardLink } from '@/components/DocsCard/styles.css';
import MostPopular from '@/components/MostPopular/MostPopular';
import { getPageConfig } from '@/utils/config';
import type { IMenuData } from '@kadena/docs-tools';
import {
  Box,
  Card,
  Grid,
  GridItem,
  Heading,
  Link,
  Stack,
  SystemIcon,
  Text,
} from '@kadena/react-ui';
import type { GetStaticProps } from 'next';
import type { FC } from 'react';
import React from 'react';

interface IProps {
  popularPages: IMostPopularPage[];
  blogPosts: IMenuData[];
}

const Home: FC<IProps> = ({ blogPosts, popularPages }) => {
  return (
    <>
      <Grid gap="lg" columns={{ sm: 1, lg: 2 }}>
        <GridItem>
          <Card fullWidth>
            <Heading as="h4">Get started with tutorials</Heading>
            <Box marginBlock="md">
              <Text variant="body">
                Building applications to run on a blockchain doesn&apos;t have
                to be hard, time-consuming, or expensive. Get started with the
                basics through hands-on tutorials. Learn how to set up a
                development network, create and fund a development wallet,
                deploy a smart contract, and more. Take the first step by
                clicking Quick start.
              </Text>
            </Box>
            <Link
              endIcon={<SystemIcon.TrailingIcon />}
              variant="outlined"
              href="/build/quickstart"
            >
              Quick start
            </Link>
          </Card>
        </GridItem>
        <GridItem>
          <Box marginBlock="xxl" marginInlineStart="xxxl">
            <MostPopular
              pages={popularPages}
              title="Most viewed docs"
              titleAs="h6"
            />
          </Box>
        </GridItem>
      </Grid>
      <Box marginBlockStart="lg" marginBlockEnd="xxxl">
        <Grid gap="lg" columns={{ sm: 1, lg: 2 }}>
          <GridItem>
            <DocsCard
              label="Quick start"
              description="Follow the Quick start to set up a development environment and deploy your first smart contract on Kadena."
              schema="warning"
              background="contribute"
            >
              <BrowseSection marker="none">
                <Link className={docsCardLink} href="/build/quickstart">
                  Quick start
                </Link>
                <Link
                  className={docsCardLink}
                  href="/build/quickstart/memorywall"
                >
                  Sign the memory wall
                </Link>
                <Link
                  className={docsCardLink}
                  href="/build/quickstart/setup-chainweaver"
                >
                  Setup Chainweaver
                </Link>
                <Link
                  className={docsCardLink}
                  href="/build/quickstart/testnet-account-setup"
                >
                  Testnet account setup
                </Link>
                <Link
                  className={docsCardLink}
                  href="/build/quickstart/pacty-parrots"
                >
                  Pacty Parrots
                </Link>
                <Link className={docsCardLink} href="/build/quickstart/dapp">
                  Build a Dapp
                </Link>
              </BrowseSection>
            </DocsCard>
          </GridItem>
          <GridItem>
            <DocsCard
              label="Cookbook"
              description="Use the right tools and platforms for building many types of decentralized applications."
              schema="success"
              background="quickstart"
            >
              <BrowseSection marker="none">
                <Link className={docsCardLink} href="/build/cookbook">
                  Pact Language API
                </Link>
                <Link className={docsCardLink} href="/build/cookbook/cookbook">
                  Kadena Client
                </Link>
              </BrowseSection>
            </DocsCard>
          </GridItem>
        </Grid>
      </Box>

      <Stack flexDirection="column" gap="xxl">
        <Box>
          <Heading as="h6">Stay up-to-date</Heading>
          <BlogPostsStrip
            data={blogPosts}
            link={`/tags/kadenajs`}
            linkLabel="More Build blogchain..."
          />
        </Box>
      </Stack>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      ...(await getPageConfig({
        blogPosts: ['kadenajs', 'cli'],
        popularPages: '/build',
        filename: __filename,
      })),
      frontmatter: {
        title: 'Build on Kadena',
        menu: 'Build',
        subTitle: 'Build your best ideas with us',
        label: 'Introduction',
        order: 1,
        description: 'Build on Kadena',
        layout: 'landing',
      },
    },
  };
};

export default Home;
