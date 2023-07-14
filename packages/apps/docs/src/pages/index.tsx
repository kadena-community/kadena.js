import { Stack } from '@kadena/react-components';
import { Box, Heading, Text } from '@kadena/react-ui';

import { BrowseSection } from '@/components';
import { Article, Content } from '@/components/Layout/components';
import { HomeHeader } from '@/components/Layout/Landing/components';
import { getTopDocs, ITopDoc } from '@/data/getTopDocs';
import {
  checkSubTreeForActive,
  getPathName,
} from '@/utils/staticGeneration/checkSubTreeForActive.mjs';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import React, { FC } from 'react';

interface IProps {
  topDocs: ITopDoc[];
}

const Home: FC<IProps> = ({ topDocs }) => {
  return (
    <>
      <HomeHeader topDocs={topDocs} />
      <Content id="maincontent" layout="home">
        <Article>
          <Box marginBottom="$10">
            <BrowseSection>
              <BrowseSection.LinkList title="General">
                <Link href="/docs/kadena">Overview of Kadena</Link>
                <Link href="/docs/kadena">Manage your KDA</Link>
                <a href="https://kadena.io">Kadena.io</a>
              </BrowseSection.LinkList>
              <BrowseSection.LinkList title="Developers">
                <Link href="/docs/kadena">Quick start</Link>
                <Link href="/docs/kadena">Pact Language resources</Link>
                <Link href="/docs/kadena">Pact developer tutorials</Link>
              </BrowseSection.LinkList>
              <BrowseSection.LinkList title="Programs">
                <Link href="/docs/kadena">Developer program</Link>
                <Link href="/docs/kadena">Ambassador program</Link>
                <Link href="/docs/kadena">Technical grants</Link>
              </BrowseSection.LinkList>
            </BrowseSection>
          </Box>
          <Heading as="h4">Browse by Resources</Heading>
          <Stack direction="column" spacing="2xl">
            <BrowseSection title="General">
              <BrowseSection.LinkBlock
                title="Overview of Pact"
                subtitle="Explore all products"
                icon="Overview"
                href="/docs/pact"
              />
              <BrowseSection.LinkBlock
                title="Chainweb"
                subtitle="Explore all products"
                icon="SmartContract"
                href="/docs/chainweb"
              />
              <BrowseSection.LinkBlock
                title="Marmalade"
                subtitle="Explore all products"
                icon="Marmalade"
                href="/docs/marmalade"
              />
            </BrowseSection>

            <BrowseSection title="Developer">
              <BrowseSection.LinkBlock
                title="Pact Language"
                subtitle="Explore all products"
                icon="PactLanguage"
                href="/docs/pact"
              />
              <BrowseSection.LinkBlock
                title="Useful Tools"
                subtitle="Explore all products"
                icon="UsefulTools"
                href="/docs/build/tools"
              />
              <BrowseSection.LinkBlock
                title="Pact Developer Tutorials"
                subtitle="Explore all products"
                icon="PactDeveloper"
                href="/docs/kadena"
              />
              <BrowseSection.LinkBlock
                title="Quickstart"
                subtitle="Explore all products"
                icon="QuickStart"
                href="/docs/chainweb"
              />
            </BrowseSection>
          </Stack>
        </Article>
      </Content>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const topDocs = await getTopDocs();

  return {
    props: {
      topDocs: topDocs,
      leftMenuTree: checkSubTreeForActive(getPathName(__filename)),
      frontmatter: {
        title: 'Welcome to Kadena docs',
        menu: 'Pact',
        label: 'Pact Test',
        order: 1,
        description: 'Home page',
        layout: 'home',
      },
    },
  };
};

export default Home;
