import { MonoChevronRight } from '@kadena/react-icons';
import {
  Box,
  Card,
  Grid,
  GridItem,
  Heading,
  Link as KadenaLink,
  Text,
} from '@kadena/react-ui';

import type { IMostPopularPage } from '@/MostPopularData';
import { BlogPostsStrip } from '@/components/BlogPostsStrip/BlogPostsStrip';
import { BrowseSection } from '@/components/BrowseSection/BrowseSection';
import { DocsCard } from '@/components/DocsCard/DocsCard';
import { docsCardLink } from '@/components/DocsCard/styles.css';
import MostPopular from '@/components/MostPopular/MostPopular';

import { marmaladeWrapperClass } from '@/styles/index.css';
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
      <Box marginBlockEnd="xxxl" className={marmaladeWrapperClass}>
        <Text variant="body">
          The long-awaited release of Marmalade’s V2 standard has arrived,
          bringing a host of exciting updates and features to the top NFT
          standard in the industry! If you’ve been tracking the progress of
          Kadena and its NFT standards, you know we’ve been on a journey from
          the unstandardised on-chain metadata and single-policy token logic in
          V1 (KIP-13) to a far more robust and dynamic V2 (KIP-20). We’re
          thrilled to share the next stage of this adventure.
        </Text>
      </Box>
      <Grid gap="lg" columns={{ sm: 1, lg: 2 }}>
        <GridItem>
          <Card fullWidth>
            <Heading as="h4">Quick start</Heading>
            <Box marginBlock="md">
              <Text variant="body">
                Marmalade is the name of the Kadena token standard. The token
                standard defines the interfaces for creating, minting, and
                transferring digital items like non-fungible tokens (NFTs) and
                token collections using Kadena smart contracts and built-in
                Kadena token policies.
              </Text>
            </Box>
            <KadenaLink
              icon={<MonoChevronRight />}
              href="/marmalade/quick-start"
            >
              Get started
            </KadenaLink>
          </Card>
        </GridItem>

        <GridItem>
          <Box marginBlockStart="xxl">
            <MostPopular pages={popularPages} title="Most viewed docs" />
          </Box>
        </GridItem>
      </Grid>

      <Box marginBlockStart="xxl" marginBlockEnd="xxxl">
        <Grid gap="lg" columns={{ sm: 1, lg: 2 }}>
          <GridItem rowSpan={2}>
            <DocsCard
              label="Overview"
              description="Marmalade provides smart contracts that execute logic configured by the built-in token policies you select or the custom policies you define."
              schema="info"
              background="marmalade"
            >
              <BrowseSection marker="none">
                <Link
                  className={docsCardLink}
                  href="/marmalade/what-is-marmalade"
                >
                  What is Marmalade?
                </Link>
                <Link className={docsCardLink} href="/marmalade/metadata">
                  Token metadata
                </Link>
                <Link
                  className={docsCardLink}
                  href="/marmalade/architecture/ledger"
                >
                  Ledger contract
                </Link>
                <Link
                  className={docsCardLink}
                  href="/marmalade/architecture/policy-manager"
                >
                  Policy manager contract
                </Link>
                <Link
                  className={docsCardLink}
                  href="/marmalade/architecture/sale-contracts"
                >
                  Sale contracts
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
                  Architecture overview
                </Link>
              </BrowseSection>
            </DocsCard>
          </GridItem>
          <GridItem>
            <DocsCard
              label="Policies"
              description="Marmalade built-in policies simplify token creation by automatically configuring and enforcing the most common token features."
              schema="success"
              background="whitepapers"
            >
              <BrowseSection marker="none">
                <Link
                  className={docsCardLink}
                  href="/marmalade/concrete-policies/non-fungible-policy"
                >
                  Non-fungible policy
                </Link>
                <Link
                  className={docsCardLink}
                  href="/marmalade/concrete-policies/guard-policy"
                >
                  Authorization policy
                </Link>
                <Link
                  className={docsCardLink}
                  href="/marmalade/concrete-policies/royalty-policy"
                >
                  Royalty policy
                </Link>
                <Link
                  className={docsCardLink}
                  href="/marmalade/concrete-policies/collection-policy"
                >
                  Collection policy
                </Link>
              </BrowseSection>
            </DocsCard>
          </GridItem>
          <GridItem>
            <DocsCard
              label="Auctions"
              description="With Marmalade, you can write smart contracts to offer tokens for sale in different ways, depending on how you want to handle the mechanics of the sale."
              schema="success"
              background="whitepapers"
            >
              <BrowseSection marker="none">
                <Link className={docsCardLink} href="/marmalade/auctions">
                  Auctions overview
                </Link>
                <Link
                  className={docsCardLink}
                  href="/marmalade/auctions/conventional-auction"
                >
                  Convention auction
                </Link>
                <Link
                  className={docsCardLink}
                  href="/marmalade/auctions/dutch-auction"
                >
                  Dutch auction
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
