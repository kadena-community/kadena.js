import { Stack } from '@kadena/react-components';
import { Heading, Text } from '@kadena/react-ui';

import { browseSectionWrapper, fullWidth } from '../../../styles/index.css';

import { BrowseSection } from '@/components';
import {
  checkSubTreeForActive,
  getPathName,
} from '@/utils/staticGeneration/checkSubTreeForActive.mjs';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import React, { FC } from 'react';

const Home: FC = () => {
  return (
    <Stack direction="column" spacing="2xl">
      <div>
        <Heading as="h2">Welcome to Kadena&apos;s documentation!</Heading>
        <Text>
          <a href="https://www.kadena.io" target="_blank" rel="noreferrer">
            Kadena
          </a>{' '}
          was founded on the idea that blockchain could revolutionize how the
          world interacts and transacts. But to get to mass adoption, chain
          technology and the ecosystem connecting it to the business world
          needed to be reimagined from the ground up. Our founders built a
          proprietary chain architecture and created the tools to make
          blockchain work for business – at speed, scale, and energy efficiency
          previously thought unachievable.&#x20; Don&apos;t forget to follow us
          on{' '}
          <a
            href="ttps://twitter.com/kadena_io"
            target="_blank"
            rel="noreferrer"
          >
            Twitter
          </a>{' '}
          for the latest updates.&#x20;
        </Text>
      </div>

      <Stack flexWrap="wrap" spacing="2xs" className={fullWidth}>
        <BrowseSection title="General" className={browseSectionWrapper}>
          <Link href="/docs/kadena/overview">Overview of Kadena</Link>
          <Link href="/docs/kadena/whitepapers">Whitepapers</Link>
          <Link href="/docs/kadena/code-of-conduct">Code of Conduct</Link>
          <a href="https://kadena.io">Kadena.io</a>
        </BrowseSection>
        <BrowseSection title="Support" className={browseSectionWrapper}>
          <Link href="/docs/kadena/support">FAQ</Link>
          <Link href="/docs/kadena/support/developer-program">
            Developer Program
          </Link>
          <Link href="/docs/kadena/support/technical-grants">
            Technical Grants
          </Link>
        </BrowseSection>
        <BrowseSection title="Resources" className={browseSectionWrapper}>
          <Link href="/docs/kadena/resources">Overview</Link>
          <Link href="/docs/kadena/resources/press-kit">Press Kit</Link>
          <Link href="/docs/kadena/resources/glossary">Glossary</Link>
          <Link href="/docs/kadena/resources/glossary/kadena-content-repository">
            Content Repo
          </Link>
        </BrowseSection>
      </Stack>
    </Stack>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      leftMenuTree: checkSubTreeForActive(getPathName(__filename)),
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
