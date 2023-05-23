import { Heading, Stack, Text } from '@kadena/react-components';

import { BrowseSection } from '@/components';
import { checkSubTreeForActive } from '@/utils/staticGeneration/checkSubTreeForActive';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import React, { FC } from 'react';

const Home: FC = () => {
  return (
    <>
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
            href="/docs/kadenajs"
          />
        </BrowseSection>
      </Stack>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
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
      <p>&nbsp;</p>
      <p>&nbsp;</p>
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
            href="/docs/kadenajs"
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
            href="/docs/chainweb"
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
            href="/docs/kadenajs"
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

      <p>&nbsp;</p>
      <p>&nbsp;</p>
      <Stack>
        <Text>
          Cookie dragée bear claw ice cream jelly beans fruitcake danish tootsie
          roll. Donut pastry tiramisu sesame snaps donut tootsie roll candy
          soufflé. Lollipop toffee ice cream jujubes cookie sugar plum
          croissant. Cookie toffee chocolate ice cream apple pie. Brownie
          gummies cupcake halvah sweet roll macaroon soufflé. Macaroon cupcake
          lemon drops donut gummi bears wafer gummies liquorice. Pie oat cake
          donut biscuit sugar plum chocolate lemon drops oat cake. Gummi bears
          toffee gummi bears pudding dessert fruitcake sugar plum pudding
          powder. Donut marzipan jelly beans candy canes toffee. Sweet toffee
          powder oat cake marzipan pie gummi bears. Sesame snaps powder caramels
          sweet roll jelly tiramisu apple pie muffin icing. Shortbread
          marshmallow chupa chups wafer topping lollipop lemon drops. Pudding
          cheesecake cookie liquorice cake gingerbread tootsie roll.
        </Text>
      </Stack>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const result = await fetch('http://localhost:3000/api/topdocs');
  const topDocs = await result.json();

  return {
    props: {
      topDocs: topDocs.body,
      leftMenuTree: checkSubTreeForActive(),
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
