import { BlogPostsStrip } from '@/components/BlogPostsStrip/BlogPostsStrip';
import { BrowseSection } from '@/components/BrowseSection/BrowseSection';
import { DocsCard } from '@/components/DocsCard/DocsCard';
import { docsCardLink } from '@/components/DocsCard/styles.css';
import { getPageConfig } from '@/utils/config';
import type { IMenuData } from '@kadena/docs-tools';
import { Box, Grid, GridItem, Heading } from '@kadena/react-ui';
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
      <Box marginBlockEnd="xxxl">
        <Grid gap="lg" columns={{ sm: 1, lg: 2 }}>
          <GridItem rowSpan={2}>
            <DocsCard
              label="We are looking for Ambassadors"
              description="Since the launch of Kadena's public blockchain, we have had
              active individuals in our community’s social channels who drive
              adoption. Whether it is keeping the community up to date, writing
              blog posts, or educating new members about the Kadena project,
              they have help promote Kadena and spread awareness."
            >
              <BrowseSection marker="none">
                <Link className={docsCardLink} href={'/contribute/ambassadors'}>
                  Become an ambassador
                </Link>
              </BrowseSection>
            </DocsCard>
          </GridItem>
          <GridItem>
            <DocsCard label="Run a node" description="">
              <BrowseSection marker="none">
                <Link className={docsCardLink} href="/contribute/node">
                  Run a Node
                </Link>

                <Link
                  className={docsCardLink}
                  href="/contribute/node/start-mining"
                >
                  Start mining
                </Link>

                <Link
                  className={docsCardLink}
                  href="/contribute/node/interact-with-nodes"
                >
                  Interact with Nodes
                </Link>

                <Link
                  className={docsCardLink}
                  href="/contribute/node/trouble-shooting-chainweb"
                >
                  Troubleshooting Chainweb
                </Link>
              </BrowseSection>
            </DocsCard>
          </GridItem>
          <GridItem>
            <DocsCard
              label="Contribute to the docs"
              description="The Kadena documentation is open source and hosted on GitHub.
              Using our public-facing Docs repo in the Kadena Community GitHub,
              you can make suggested changes using pull requests. This allows
              community members to improve the documentation and helps improve
              the Kadena developer experience."
            >
              <BrowseSection marker="none">
                <Link className={docsCardLink} href={'/contribute/docs'}>
                  Fix our docs
                </Link>
              </BrowseSection>
            </DocsCard>
          </GridItem>
        </Grid>
      </Box>

      <Heading as="h6">Stay up-to-date</Heading>
      <BlogPostsStrip data={blogPosts} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      ...(await getPageConfig({
        blogPosts: ['ambassadors', 'grant'],
        filename: __filename,
      })),
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
