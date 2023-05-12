import { Stack, Text } from '@kadena/react-components';

import { BrowseSection } from '@/components';
import { IDocsPageFC } from '@/types/Layout';
import React from 'react';

const Home: IDocsPageFC = () => {
  return (
    <>
      <Stack direction="column" spacing="2xl">
        <BrowseSection title="General">
          <BrowseSection.Section
            title="Overview of Pact"
            subtitle="Explore all products"
            icon="Overview"
            href="/docs/pact"
          />
          <BrowseSection.Section
            title="Smart Contracts"
            subtitle="Explore all products"
            icon="SmartContract"
            href="/docs/kadenajs"
          />
          <BrowseSection.Section
            title="Syntax"
            subtitle="Explore all products"
            icon="Syntax"
            href="/docs/kadena"
          />
          <BrowseSection.Section
            title="Contribute"
            subtitle="Explore all products"
            icon="Contribute"
            href="/docs/chainweb"
          />
        </BrowseSection>

        <BrowseSection title="Developer">
          <BrowseSection.Section
            title="Pact Language"
            subtitle="Explore all products"
            icon="PactLanguage"
            href="/docs/pact"
          />
          <BrowseSection.Section
            title="Useful Tools"
            subtitle="Explore all products"
            icon="UsefulTools"
            href="/docs/kadenajs"
          />
          <BrowseSection.Section
            title="Pact Developer Tutorials"
            subtitle="Explore all products"
            icon="PactDeveloper"
            href="/docs/kadena"
          />
          <BrowseSection.Section
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

Home.meta = {
  title: 'Pact',
  menu: 'Pact',
  label: 'Pact Test',
  order: 1,
  description: 'Home page',
  layout: 'home',
};

export default Home;
