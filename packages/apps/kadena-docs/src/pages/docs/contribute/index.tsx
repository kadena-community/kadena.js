import { Stack } from '@kadena/react-components';

import { BrowseSection } from '@/components';
import { getTopDocs } from '@/data/getTopDocs';
import { checkSubTreeForActive } from '@/utils/staticGeneration/checkSubTreeForActive';
import { GetStaticProps } from 'next';
import React, { FC } from 'react';

const Home: FC = () => {
  return (
    <Stack direction="column" spacing="2xl">
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
        title: 'Contribute',
        menu: 'Contribute',
        subTitle: 'Be a part of our ecosystem',
        label: 'Contribute',
        order: 4,
        description: 'Be a part of our ecosystem',
        layout: 'landing',
        icon: 'Contribute',
      },
    },
  };
};

export default Home;
