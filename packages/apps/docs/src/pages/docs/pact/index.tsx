import { Box, Button, Card, Heading, Stack, Text } from '@kadena/react-ui';

import { BrowseSection, MostPopular } from '@/components';
import {
  articleClass,
  contentClass,
  contentClassVariants,
} from '@/components/Layout/components';
import { browseSectionWrapper } from '@/styles/index.css';
import type { IMostPopularPage } from '@/types/MostPopularData';
import getMostPopularPages from '@/utils/getMostPopularPages';
import {
  checkSubTreeForActive,
  getPathName,
} from '@/utils/staticGeneration/checkSubTreeForActive.mjs';
import classNames from 'classnames';
import type { GetStaticProps } from 'next';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';

interface IProps {
  popularPages: IMostPopularPage[];
}

const Home: FC<IProps> = ({ popularPages }) => {
  return (
    <div
      className={classNames(contentClass, contentClassVariants.home)}
      id="main"
    >
      <article className={articleClass}>
        <Stack
          justifyContent="space-between"
          direction={{ sm: 'column', lg: 'row' }}
        >
          <Card>
            <Heading as="h4">Getting started with Pact</Heading>
            <Box marginY="$4">
              <Text>Learn the basics of Pact to create a smart contract</Text>
            </Box>
            <Button as="a" asChild>
              <Link href={'/docs/pact/beginner'}>Getting started</Link>
            </Button>
          </Card>
          <Box
            marginTop="$8"
            marginLeft={{ sm: 0, lg: '$4' }}
            marginRight={{ sm: 0, xl: '$32' }}
          >
            <MostPopular pages={popularPages} title="Most viewed docs" />
          </Box>
        </Stack>

        <Box marginTop="$4">
          <BrowseSection title="Learn about Pact" titleAs="h5" direction="row">
            <BrowseSection.LinkBlock
              title="Language reference"
              subtitle="Reference for the Pact smart-contract language, designed for correct, transactional execution on a high-performance blockchain"
              href="/docs/pact/reference"
            />
            <BrowseSection.LinkBlock
              title="Pact CLI"
              subtitle="Generate client based on a contract with our Cli"
              href="/docs/pact/cli"
            />
            <BrowseSection.LinkBlock
              title="White paper"
              subtitle="Pact is the programming language for writing smart contracts to be executed
              by the Kadena blockchain"
              href="/docs/kadena/whitepapers/pact-smart-contract-language"
            />
          </BrowseSection>
        </Box>
      </article>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const mostPopularPages = await getMostPopularPages('/docs/pact');

  return {
    props: {
      popularPages: mostPopularPages,
      leftMenuTree: checkSubTreeForActive(getPathName(__filename)),
      frontmatter: {
        title: 'Learn Pact',
        menu: 'Pact',
        label: 'Pact',
        order: 3,
        description: 'Kadena makes blockchain work for everyone.',
        layout: 'landing',
      },
    },
  };
};

export default Home;
