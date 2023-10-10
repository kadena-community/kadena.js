import { Box, Grid, Heading } from '@kadena/react-ui';

import { BlogPostsStrip } from '@/components/BlogPostsStrip/BlogPostsStrip';
import { BrowseSection } from '@/components/BrowseSection/BrowseSection';
import { DocsCard } from '@/components/DocsCard/DocsCard';
import { docsCardLink } from '@/components/DocsCard/styles.css';
import type { IMenuData } from '@/Layout';
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
          <Grid.Item rowSpan={2}>
            <DocsCard
              label="We are looking for Ambassadors"
              description="Since the launch of Kadena's public blockchain, we have had
              active individuals in our community’s social channels who drive
              adoption. Whether it is keeping the community up to date, writing
              blog posts, or educating new members about the Kadena project,
              they have help promote Kadena and spread awareness."
              schema="info"
              background="contribute"
            >
              <BrowseSection marker="none">
                <Link className={docsCardLink} href={'/contribute/ambassadors'}>
                  Become an ambassador
                </Link>
              </BrowseSection>
            </DocsCard>
          </Grid.Item>
          <Grid.Item>
            <DocsCard
              label="Run a node"
              description=""
              schema="warning"
              background="marmalade"
            >
              <BrowseSection marker="none">
                <Link className={docsCardLink} href="/docs/contribute/node">
                  Run a Node
                </Link>

                <Link
                  className={docsCardLink}
                  href="/docs/contribute/node/start-mining"
                >
                  Start mining
                </Link>

                <Link
                  className={docsCardLink}
                  href="/docs/contribute/node/interact-with-nodes"
                >
                  Interact with Nodes
                </Link>

                <Link
                  className={docsCardLink}
                  href="/docs/contribute/node/troubleshooting-chainweb"
                >
                  Troubleshooting Chainweb
                </Link>
              </BrowseSection>
            </DocsCard>
          </Grid.Item>
          <Grid.Item>
            <DocsCard
              label="Contribute to the docs"
              description="The Kadena documentation is open source and hosted on GitHub.
              Using our public-facing Docs repo in the Kadena Community GitHub,
              you can make suggested changes using pull requests. This allows
              community members to improve the documentation and helps improve
              the Kadena developer experience."
              schema="success"
              background="whitepapers"
            >
              <BrowseSection marker="none">
                <Link className={docsCardLink} href={'/contribute/contribute'}>
                  Fix our docs
                </Link>
              </BrowseSection>
            </DocsCard>
          </Grid.Item>
        </Grid.Root>
      </Box>

      <Heading as="h6">Stay up-to-date</Heading>
      <BlogPostsStrip data={blogPosts} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const blogPosts = await getBlogPosts(['ambassadors', 'grant']);

  return {
    props: {
      blogPosts,
      leftMenuTree: checkSubTreeForActive(getPathName(__filename)),
      frontmatter: {
        title: 'Contribute',
        menu: 'Contribute',
        subTitle: 'Be a part of our ecosystem',
        label: 'Contribute',
        order: 6,
        description: 'Be a part of our ecosystem',
        layout: 'landing',
      },
    },
  };
};

export default Home;
