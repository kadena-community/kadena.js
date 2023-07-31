import { Box, Heading, Stack } from '@kadena/react-ui';

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
                <Link href="/docs/kadena/kda/manage-kda">Manage your KDA</Link>
                <a href="https://kadena.io" target="_blank" rel="noreferrer">
                  Kadena.io
                </a>
              </BrowseSection.LinkList>
              <BrowseSection.LinkList title="Developers">
                <Link href="/docs/build/quickstart">Quick start</Link>
                <Link href="/docs/pact/beginner/language-basics">
                  Pact Language resources
                </Link>
                <Link href="/docs/pact">Pact developer tutorials</Link>
              </BrowseSection.LinkList>
              <BrowseSection.LinkList title="Programs">
                <Link href="/docs/build/support">Developer program</Link>
                <Link href="/docs/contribute/ambassadors">
                  Ambassador program
                </Link>
                <Link href="/docs/build/support/technical-grants">
                  Technical grants
                </Link>
              </BrowseSection.LinkList>
            </BrowseSection>
          </Box>
          <Heading as="h4">Browse by Resources</Heading>
          <Stack direction="column" spacing="$2xl">
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

            <BrowseSection title="Pact">
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
                title="Beginner Tutorials"
                subtitle="For starters"
                icon="PactDeveloper"
                href="/docs/pact/beginner"
              />
              <BrowseSection.LinkBlock
                title="Intermediate Tutorials"
                subtitle="get some more experience"
                icon="PactDeveloper"
                href="docs/pact/intermediate"
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
        description:
          "Welcome to Kadena's documentation! All our Documentation in 1 place. Pact, ChainWeb, KDA, Marmalade etc",
        layout: 'home',
      },
    },
  };
};

export default Home;
