import { Box, Button, Card, Heading, Stack, Text } from '@kadena/react-ui';

import { BrowseSection } from '@/components';
import {
  cardClass,
  cardSectionClass,
} from '@/components/Layout/Home/styles.css';
import {
  checkSubTreeForActive,
  getPathName,
} from '@/utils/staticGeneration/checkSubTreeForActive.mjs';
import type { GetStaticProps } from 'next';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';

const Home: FC = () => {
  return (
    <>
      <div className={cardSectionClass}>
        <section className={cardClass}>
          <Heading as="h4">Kadena DAO</Heading>
          <Box marginY="$4">
            <Text>
              Kadena has built the framework for the first DAO, Decentralized
              Autonomous Organization, on its public blockchain called dao.init.
              As Kadena’s ecosystem continues to grow, the creation of a DAO
              will allow for the broader community to provide their input in a
              decentralized manner.
            </Text>
          </Box>
          <Button as="a" asChild>
            <Link href={'/docs/contribute/kadena-dao'}>Start contributing</Link>
          </Button>
        </section>
        <section className={cardClass}>
          <Heading as="h4">We are looking for Ambassadors</Heading>
          <Box marginY="$4">
            <Text>
              Since the launch of Kadena&apos;s public blockchain, we have had
              active individuals in our community’s social channels who drive
              adoption. Whether it is keeping the community up to date, writing
              blog posts, or educating new members about the Kadena project,
              they have help promote Kadena and spread awareness.
            </Text>
          </Box>
          <Button as="a" asChild>
            <Link href={'/docs/contribute/ambassadors'}>
              Become an ambassador
            </Link>
          </Button>
        </section>

        <section className={cardClass}>
          <Heading as="h4">Run a Node</Heading>
          <Box marginY="$4">
            <Text>
              <ul>
                <li>
                  <Link href="/docs/contribute/node">Run a Node</Link>
                </li>
                <li>
                  <Link href="/docs/contribute/node/start-mining">
                    Start mining
                  </Link>
                </li>
                <li>
                  <Link href="/docs/contribute/node/interact-with-nodes">
                    Interact with Nodes
                  </Link>
                </li>
                <li>
                  <Link href="/docs/contribute/node/troubleshooting-chainweb">
                    Troubleshooting Chainweb
                  </Link>
                </li>
              </ul>
            </Text>
          </Box>
        </section>

        <section className={cardClass}>
          <Heading as="h4">Contribute to the docs</Heading>
          <Box marginY="$4">
            <Text>
              The Kadena documentation is open source and hosted on GitHub.
              Using our public-facing Docs repo in the Kadena Community GitHub,
              you can make suggested changes using pull requests. This allows
              community members to improve the documentation and helps improve
              the Kadena developer experience.
            </Text>
          </Box>
          <Button as="a" asChild>
            <Link href={'/docs/contribute/contribute'}>Fix our docs</Link>
          </Button>
        </section>
      </div>
    </>
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
