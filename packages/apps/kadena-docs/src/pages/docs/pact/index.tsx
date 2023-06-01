import { Heading, Stack, Text } from '@kadena/react-components';

import { BrowseSection } from '@/components';
import { getTopDocs } from '@/data/getTopDocs';
import { checkSubTreeForActive } from '@/utils/staticGeneration/checkSubTreeForActive';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import React, { FC } from 'react';

const Home: FC = () => {
  return (
    <Stack direction="column" spacing="2xl">
      <div>
        <Heading as="h2">What is Pact?</Heading>
        <Text>
          Pact is a human-readable smart contract language. It allows anyone to
          write clearly, directly and safely onto a blockchain — a true
          innovation for secure and simple smart contract development. Pact will
          enable you to create entirely new business models and on-chain
          services.
        </Text>
      </div>
      <div>
        <Heading as="h2">How to use the Pact Developer Tutorials</Heading>
        <Text>
          Pact Developer Tutorials offer the training needed to learn the Pact
          programming language. They teach skills from beginner to advanced that
          are designed to help you develop blockchain applications with Pact.
        </Text>
      </div>
      <div>
        <Heading as="h2">Prerequisites</Heading>
        <Text>
          These free tutorials have no prerequisites. Learn whenever and however
          you want using the documentation and complimentary videos for each
          lesson. Start with our{' '}
          <Link href="/beginner/welcome-to-pact">Beginner Tutorial Series</Link>{' '}
          which covers Pact’s fundamental concepts, followed by real smart
          contract projects you can deploy to our Testnet.
        </Text>
      </div>

      <BrowseSection>
        <BrowseSection.LinkList title="Connect with our community">
          <a href="https://discord.gg/Z2fq23YJgg">Discord Channel</a>
          <a href="https://github.com/kadena-io/pact">Pact GitHub</a>
          <a href="https://stackoverflow.com/search?q=pact-lang">#pact-lang</a>
          <a href="https://kadena.io/subscribe/">Newsletter</a>
          <a href="https://twitter.com/kadena_io">Twitter</a>
        </BrowseSection.LinkList>
      </BrowseSection>
    </Stack>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const topDocs = await getTopDocs();

  return {
    props: {
      topDocs: topDocs,
      leftMenuTree: checkSubTreeForActive(),
      frontmatter: {
        title: 'Learn Pact',
        menu: 'Pact',
        subTitle: 'Welcome to the Pact Developer Tutorials',
        label: 'Pact',
        order: 3,
        description: 'Kadena makes blockchain work for everyone.',
        layout: 'landing',
        icon: 'PactDeveloper',
      },
    },
  };
};

export default Home;
