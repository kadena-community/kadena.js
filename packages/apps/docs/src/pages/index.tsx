import { Stack } from '@kadena/react-components';
import { Box, Heading } from '@kadena/react-ui';

import { browseSectionWrapper } from '../styles/index.css';

import { BrowseSection } from '@/components';
import { Article, Content } from '@/components/Layout/components';
import { HomeHeader } from '@/components/Layout/Landing/components';
import { IMostPopularPage } from '@/types/MostPopularData';
import getMostPopularPages from '@/utils/getMostPopularPages';
import {
  checkSubTreeForActive,
  getPathName,
} from '@/utils/staticGeneration/checkSubTreeForActive.mjs';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import React, { FC } from 'react';

interface IProps {
  popularPages: IMostPopularPage[];
}

const Home: FC<IProps> = ({ popularPages }) => {
  return (
    <>
      <HomeHeader popularPages={popularPages} />
      <Content id="maincontent" layout="home">
        <Article>
          <Box marginBottom="$10">
            <Stack flexWrap="wrap" spacing="2xs">
              <BrowseSection title="General" className={browseSectionWrapper}>
                <Link href="/docs/kadena">Overview of Kadena</Link>
                <Link href="/docs/kadena/kda/manage-kda">Manage your KDA</Link>
                <a href="https://kadena.io" target="_blank" rel="noreferrer">
                  Kadena.io
                </a>
              </BrowseSection>
              <BrowseSection
                title="Developers"
                className={browseSectionWrapper}
              >
                <Link href="/docs/build/quickstart">Quick start</Link>
                <Link href="/docs/pact/beginner/language-basics">
                  Pact Language resources
                </Link>
                <Link href="/docs/pact">Pact developer tutorials</Link>
              </BrowseSection>
              <BrowseSection title="Programs" className={browseSectionWrapper}>
                <Link href="/docs/build/support">Developer program</Link>
                <Link href="/docs/contribute/ambassadors">
                  Ambassador program
                </Link>
                <Link href="/docs/build/support/technical-grants">
                  Technical grants
                </Link>
              </BrowseSection>
            </Stack>
          </Box>
          <Heading as="h4">Browse by Resources</Heading>
          <Stack direction="column" spacing="2xl">
            <BrowseSection title="General" titleAs="h5" direction="row">
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
            <BrowseSection title="Pact" titleAs="h5" direction="row">
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
  const mostPopularPages = await getMostPopularPages();

  return {
    props: {
      popularPages: mostPopularPages,
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
