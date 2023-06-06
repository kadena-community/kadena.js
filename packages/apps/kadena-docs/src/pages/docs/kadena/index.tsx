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
        <Heading as="h2">Welcome to Kadena&apos;s documentation!</Heading>
        <Text>
          <a href="https://www.kadena.io">Kadena</a> was founded on the idea
          that blockchain could revolutionize how the world interacts and
          transacts. But to get to mass adoption, chain technology and the
          ecosystem connecting it to the business world needed to be reimagined
          from the ground up. Our founders built a proprietary chain
          architecture and created the tools to make blockchain work for
          business – at speed, scale, and energy efficiency previously thought
          unachievable.&#x20; Don&apos;t forget to follow us on
          [Twitter](https://twitter.com/kadena_io) for the latest updates.&#x20;
        </Text>
      </div>

      <div>
        <Heading as="h4">My Shortcuts</Heading>
        <Stack direction="column" spacing="2xl">
          <BrowseSection>
            <BrowseSection.LinkBlock
              title="Rest API"
              subtitle="Built-in HTTP and SQL backend"
              icon="RestApi"
              href="/docs/pact"
            />
            <BrowseSection.LinkBlock
              title="Concepts"
              subtitle="Distinct Execution modes"
              icon="Concepts"
              href="/docs/kadena"
            />
          </BrowseSection>
        </Stack>
      </div>
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

      <div>
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
              title="Smart Contracts"
              subtitle="Explore all products"
              icon="SmartContract"
              href="/docs/kadena"
            />
            <BrowseSection.LinkBlock
              title="Syntax"
              subtitle="Explore all products"
              icon="Syntax"
              href="/docs/kadena"
            />
            <BrowseSection.LinkBlock
              title="Contribute"
              subtitle="Explore all products"
              icon="Contribute"
              href="/docs/build"
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
              href="/docs/kadena"
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
              href="/docs/build"
            />
          </BrowseSection>
        </Stack>
      </div>
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
