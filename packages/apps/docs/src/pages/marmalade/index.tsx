import {
  Box,
  Button,
  Card,
  Grid,
  GridItem,
  Heading,
  Text,
} from '@kadena/react-ui';

import type { IMostPopularPage } from '@/MostPopularData';
import { BlogPostsStrip } from '@/components/BlogPostsStrip/BlogPostsStrip';
import { BrowseSection } from '@/components/BrowseSection/BrowseSection';
import { DocsCard } from '@/components/DocsCard/DocsCard';
import { docsCardLink } from '@/components/DocsCard/styles.css';
import MostPopular from '@/components/MostPopular/MostPopular';
import { getPageConfig } from '@/utils/config';
import type { IMenuData } from '@kadena/docs-tools';
import type { GetStaticProps } from 'next';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';

interface IProps {
  blogPosts: IMenuData[];
  popularPages: IMostPopularPage[];
}

const Home: FC<IProps> = ({ blogPosts, popularPages }) => {
  return (
    <>
      <Box marginRight={{ sm: 0, lg: '$32', xl: '$64' }} marginBottom="$10">
        <Text>
          The long-awaited release of Marmalade’s V2 standard has arrived,
          bringing a host of exciting updates and features to the top NFT
          standard in the industry! If you’ve been tracking the progress of
          Kadena and its NFT standards, you know we’ve been on a journey from
          the unstandardised on-chain metadata and single-policy token logic in
          V1 (KIP-13) to a far more robust and dynamic V2 (KIP-20). We’re
          thrilled to share the next stage of this adventure.
        </Text>
      </Box>
      <Grid gap="$lg" columns={{ sm: 1, lg: 2 }}>
        <GridItem>
          <Card fullWidth>
            <Heading as="h4">Quick start</Heading>
            <Box marginY="$4">
              <Text>
                Marmalade is an NFT smart contract system on Kadena’s
                blockchain. It comprises multiple smart contracts that execute
                logic configured by the token policies with which the token is
                built. Marmalade has been in action for several years, and now
                we’ve diligently upgraded to Marmalade V2, introducing an
                entirely new system that simplifies the process of engaging with
                NFTs.
              </Text>
            </Box>
            <Button as="a" asChild icon="TrailingIcon">
              <Link href={'/marmalade/quick-start'}>Get started</Link>
            </Button>
          </Card>
        </GridItem>

        <GridItem>
          <Box marginTop="$8">
            <MostPopular pages={popularPages} title="Most viewed docs" />
          </Box>
        </GridItem>
      </Grid>

      <Box marginBottom="$20">
        <Grid gap="$lg" columns={{ sm: 1, lg: 2 }}>
          <GridItem rowSpan={2}>
            <DocsCard
              label="Overview"
              description="Marmalade is an NFT smart contract system on Kadena’s blockchain. It comprises multiple smart contracts that execute logic configured by the token policies with which the token is built. Now we’ve diligently upgraded to Marmalade V2, introducing an entirely new system that simplifies the process of engaging with NFTs."
              schema="info"
              background="marmalade"
            >
              <BrowseSection marker="none">
                <Link className={docsCardLink} href="/marmalade/architecture">
                  Architecture
                </Link>
                <Link
                  className={docsCardLink}
                  href="/marmalade/concrete-policies"
                >
                  Policies
                </Link>
                <Link className={docsCardLink} href="/marmalade/metadata">
                  Metadata
                </Link>
              </BrowseSection>
            </DocsCard>
          </GridItem>
          <GridItem>
            <DocsCard
              label="Architecture"
              description="The introduction of the multi-policy model in Marmalade V2 aims to enhance the user experience by simplifying token creation and management."
              schema="warning"
              background="react"
            >
              <BrowseSection marker="none">
                <Link className={docsCardLink} href="/marmalade/architecture">
                  Architecture Overview
                </Link>
              </BrowseSection>
            </DocsCard>
          </GridItem>
          <GridItem>
            <DocsCard
              label="Policies"
              description="Marmalade V2 aims to broaden its audience by providing a tool to simplify the token creation process, offering a set of policies that encompass commonly used token features, referred to as /marmalade/concrete-policies."
              schema="success"
              background="whitepapers"
            >
              <BrowseSection marker="none">
                <Link
                  className={docsCardLink}
                  href="/marmalade/concrete-policies"
                >
                  Policies Overview
                </Link>
              </BrowseSection>
            </DocsCard>
          </GridItem>
        </Grid>
      </Box>

      <Heading as="h6">Stay up-to-date</Heading>
      <BlogPostsStrip
        data={blogPosts}
        link={`/tags/marmalade`}
        linkLabel="More Pact blogchain..."
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      ...(await getPageConfig({
        blogPosts: ['marmalade', 'nft'],
        popularPages: '/marmalade',
        filename: __filename,
      })),
      frontmatter: {
        title: 'Build with Marmalade',
        menu: 'Marmalade',
        subTitle: 'Build your best ideas with us',
        label: 'Overview',
        order: 6,
        description:
          'The long-awaited release of Marmalade’s V2 standard has arrived, bringing a host of exciting updates and features to the top NFT standard in the industry! If you’ve been tracking the progress of Kadena and its NFT standards, you know we’ve been on a journey from the unstandardised on-chain metadata and single-policy token logic in V1 (KIP-13) to a far more robust and dynamic V2 (KIP-20). We’re thrilled to share the next stage of this adventure.',
        layout: 'landing',
      },
    },
  };
};

export default Home;
