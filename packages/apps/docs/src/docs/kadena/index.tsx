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
          <GridItem rowSpan={2}>
            <DocsCard
              label="General"
              description="Kadena was founded on the idea that blockchain could revolutionize how the world interacts and transacts. But to get to mass adoption, chain technology and the ecosystem connecting it to the business world needed to be reimagined from the ground up. Our founders built a proprietary chain architecture and created the tools to make blockchain work for business – at speed, scale, and energy efficiency previously thought unachievable."
            >
              <BrowseSection marker="none">
                <Link className={docsCardLink} href="/kadena/why-kadena">
                  Why Kadena?
                </Link>
                <Link className={docsCardLink} href="/kadena/kadena-faq">
                  Frequently asked questions
                </Link>
                <a className={docsCardLink} href="https://kadena.io">
                  Kadena.io
                </a>
              </BrowseSection>
            </DocsCard>
          </GridItem>
          <GridItem>
            <DocsCard
              label="Resources"
              description="Miscellaneous resources to make your Kadena journey easier."
            >
              <BrowseSection marker="none">
                <Link className={docsCardLink} href="/kadena/glossary">
                  Glossary
                </Link>
                <Link className={docsCardLink} href="/kadena/resources">
                  Articles, videos, and more
                </Link>
              </BrowseSection>
            </DocsCard>
          </GridItem>
          <GridItem>
            <DocsCard
              label="Whitepapers"
              description="Read up on the different aspects of Kadena in our whitepapers."
            >
              <BrowseSection marker="none">
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
        </Grid>
      </Box>

      <Box>
        <Heading as="h6" transform="uppercase">
          Stay up-to-date
        </Heading>
        <BlogPostsStrip
          data={blogPosts}
          link={`/tags/kadena`}
          linkLabel="Learn more about Kadena..."
        />
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
