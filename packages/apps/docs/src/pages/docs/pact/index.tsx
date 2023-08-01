import { Button, Card, Grid, Heading, Stack, Text } from '@kadena/react-ui';

import { BrowseSection } from '@/components';
import { MostPopular } from '@/components/MostPopular';
import { IMostPopularPage } from '@/types/MostPopularData';
import getMostPopularPages from '@/utils/getMostPopularPages';
import {
  checkSubTreeForActive,
  getPathName,
} from '@/utils/staticGeneration/checkSubTreeForActive.mjs';
import { GetStaticProps } from 'next';
import React, { FC } from 'react';

interface IProps {
  popularPages: IMostPopularPage[];
}

const Home: FC<IProps> = ({ popularPages = [] }) => {
  return (
    <Stack direction="column" spacing="$2xl">
      <Stack direction="column" spacing="$md">
        <Stack direction="column">
          <Heading as="h4">Smart-contract language</Heading>
          <Text as="p">
            designed for correct, transactional execution on a high-performance
            blockchain.
          </Text>
        </Stack>
        <Grid.Root columns={10} spacing="md">
          <Grid.Item
            columnSpan={{
              sm: 10,
              md: 7,
            }}
          >
            <Card>
              <Stack direction="column" spacing="$sm">
                <Heading as="h6">Getting Started is Simple</Heading>
                <Text as="p">
                  Learn Kadena&apos;s core concepts & tools for development in
                  15 minutes.
                </Text>
                <Stack direction="row" spacing="$sm">
                  <Button
                    title="Get Started"
                    iconAlign="right"
                    icon="TrailingIcon"
                  >
                    Get Started
                  </Button>
                  <Button title="Hello world tutorial" as="a" href="/">
                    Hello world tutorial
                  </Button>
                </Stack>
              </Stack>
            </Card>
          </Grid.Item>
          {popularPages.length > 0 && (
            <Grid.Item
              columnSpan={{
                sm: 10,
                md: 3,
              }}
            >
              <MostPopular pages={popularPages} title="Most viewed pact docs" />
            </Grid.Item>
          )}
        </Grid.Root>
      </Stack>
      <Stack direction="column" spacing="$md">
        <Heading as="h6">Browse by Resources</Heading>
        <Stack direction="column" spacing="$md">
          <BrowseSection title="General" titleAs="h6" direction="row">
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
          <BrowseSection title="Pact" titleAs="h6" direction="row">
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
      </Stack>
    </Stack>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const mostPopularPages = await getMostPopularPages('/docs/pact');
  return {
    props: {
      popularPages: mostPopularPages,
      leftMenuTree: checkSubTreeForActive(getPathName(__filename)),
      frontmatter: {
        title: 'Pact',
        menu: 'Pact',
        subTitle: 'The safest, most user-friendly language for smart contracts',
        label: 'Introduction',
        order: 0,
        description: 'Kadena makes blockchain work for everyone.',
        layout: 'landing',
        icon: 'PactDeveloper',
      },
    },
  };
};

export default Home;
