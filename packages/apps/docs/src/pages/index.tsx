import { Box, Heading, Stack } from '@kadena/react-ui';

import { BrowseSection } from '@/components';
import {
  articleClass,
  contentClass,
  contentClassVariants,
} from '@/components/Layout/components';
import { HomeHeader } from '@/components/Layout/Landing/components';
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
    <>
      <HomeHeader popularPages={popularPages} />
      <div
        className={classNames(contentClass, contentClassVariants.home)}
        id="maincontent"
      >
        <article className={articleClass}>
          <Box marginBottom="$10">
            <Heading as="h4">Getting started</Heading>
            <Stack wrap="wrap">
              <BrowseSection
                title="Core concepts"
                className={browseSectionWrapper}
              >
                <Link href="/docs/kadena/overview">
                  What is the Kadena Blockchain?
                </Link>
                <Link href="/docs/kadena/kda">What is KDA token?</Link>
                <Link href="/docs/pact">What are Pact smart contracts?</Link>
              </BrowseSection>
              <BrowseSection
                title="Developers"
                className={browseSectionWrapper}
              >
                <Link href="/docs/build/quickstart">
                  Learn through tutorials
                </Link>
                <Link href="/docs/pact/beginner/language-basics">
                  Pact Language resources
                </Link>
                <Link href="/docs/pact">Pact developer tutorials</Link>
              </BrowseSection>
              <BrowseSection
                title="Setup local environment"
                className={browseSectionWrapper}
              >
                <Link href="/docs/build/support">Developer program</Link>
                <Link href="/docs/contribute/ambassadors">
                  Ambassador program
                </Link>
                <Link href="/docs/build/support/technical-grants">
                  Technical grants
                </Link>
              </BrowseSection>
            </Stack>
          </Box>

          <Box marginBottom="$10">
            <Stack wrap="wrap">
              <BrowseSection title="General" className={browseSectionWrapper}>
                <Link href="/docs/kadena">Overview of Kadena</Link>
                <Link href="/docs/kadena/kda/manage-kda">Manage your KDA</Link>
                <a href="https://kadena.io" target="_blank" rel="noreferrer">
                  Kadena.io
                </a>
              </BrowseSection>
              <BrowseSection
                title="Useful tools"
                className={browseSectionWrapper}
              >
                <Link href="/docs/build/support">
                  Chainweaver (Wallet & Workbench)
                </Link>
                <Link href="/docs/kadena/wallets/chainweaver">Atom IDE</Link>
                <a href="https://explorer.chainweb.com/mainnet">
                  Block Explorer
                </a>
                <a href="https://transfer.chainweb.com/">Web transfer tools</a>
                <a href="https://balance.chainweb.com/">Balance checker</a>
              </BrowseSection>
              <BrowseSection title="Programs" className={browseSectionWrapper}>
                <Link href="/docs/build/support">Developer program</Link>
                <Link href="/docs/contribute/ambassadors">
                  Ambassador program
                </Link>
                <Link href="/docs/build/support/technical-grants">
                  Technical grants
                </Link>
                <a href="https://github.com/kadena-community/create-kadena-app">
                  Bootstrap Kadena dApp
                </a>
                <a href="https://hub.docker.com/r/kadena/devnet">
                  Devnet Docker Container
                </a>
                <a href="https://github.com/kadena-io/pact#installing-pact">
                  Pact binary
                </a>
              </BrowseSection>
            </Stack>
          </Box>

          <Stack direction="column" gap="$2xl">
            <BrowseSection title="General" titleAs="h5" direction="row">
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
          </Stack>
        </article>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const mostPopularPages = await getMostPopularPages();

  return {
    props: {
      popularPages: mostPopularPages,
      leftMenuTree: checkSubTreeForActive(getPathName(__filename)),
      frontmatter: {
        title: 'Welcome to Kadena docs',
        menu: 'Pact',
        label: 'Pact Test',
        order: 1,
        description:
          "Welcome to Kadena's documentation! All our Documentation in 1 place. Pact, ChainWeb, KDA, Marmalade etc",
        layout: 'home',
      },
    },
  };
};

export default Home;
