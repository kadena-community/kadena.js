import { Stack } from '@kadena/react-components';

import { BrowseSection } from '@/components';
import {
  checkSubTreeForActive,
  getPathName,
} from '@/utils/staticGeneration/checkSubTreeForActive';
import { GetStaticProps } from 'next';
import React, { FC } from 'react';

const Home: FC = () => {
  return (
    <Stack direction="column" spacing="2xl">
      <BrowseSection>
        <BrowseSection.LinkBlock
          title="Run a Node"
          subtitle=" "
          icon="RestApi"
          href="node/overview"
        />
        <BrowseSection.LinkBlock
          title="Ambassadors"
          subtitle=" "
          icon="Contribute"
          href="ambassadors/overview"
        />
        <BrowseSection.LinkBlock
          title="Kadena DAO"
          subtitle=" "
          icon="Concepts"
          href="kadena-dao"
        />
      </BrowseSection>
    </Stack>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      leftMenuTree: checkSubTreeForActive(getPathName(__filename)),
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
