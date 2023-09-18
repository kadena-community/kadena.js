import { Box, Heading, Stack, Text } from '@kadena/react-ui';

import { browseSectionWrapper } from '../../../styles/index.css';

import { BrowseSection } from '@/components';
import { BlogPostsStrip } from '@/components/BlogPostsStrip';
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
  console.log(blogPosts);
  return (
    <Stack direction="column" gap="$2xl">
      <div>
        <Heading as="h2">Welcome to Kadena</Heading>
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

      <Stack wrap="wrap" width="100%">
        <BrowseSection title="General" className={browseSectionWrapper}>
          <Link href="/docs/kadena/overview">Overview of Kadena</Link>
          <Link href="/docs/kadena/whitepapers">Whitepapers</Link>
          <Link href="/docs/kadena/code-of-conduct">Code of Conduct</Link>
          <a href="https://kadena.io">Kadena.io</a>
        </BrowseSection>

        <BrowseSection title="Whitepapers" className={browseSectionWrapper}>
          <Link href="/docs/kadena/whitepapers/chainweb-layer-1">
            Chainweb layer 1
          </Link>
          <Link href="/docs/kadena/whitepapers/pact-smart-contract-language">
            Pact Smart Contract
          </Link>
          <Link href="/docs/kadena/whitepapers/kuro-layer-2">Kuro Layer 2</Link>
        </BrowseSection>
      </Stack>

      <Box>
        <Heading as="h4">Latest Kadena posts</Heading>
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
