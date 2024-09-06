import type { IMostPopularPage } from '@/MostPopularData';
import { BrowseSection } from '@/components/BrowseSection/BrowseSection';
import { ChangelogTable } from '@/components/ChangelogTable/ChangelogTable';
import { DocsCard } from '@/components/DocsCard/DocsCard';
import { docsCardLink } from '@/components/DocsCard/styles.css';
import { HomeHeader } from '@/components/Layout/Landing/components';
import {
  articleClass,
  containerClass,
  contentClass,
  contentClassVariants,
} from '@/components/Layout/components/articleStyles.css';
import changelogs from '@/data/changelogs.json';
import {
  getPackages,
  getVersions,
} from '@/scripts/importChangelogs/utils/misc';
import { getPageConfig } from '@/utils/config';
import { MonoList } from '@kadena/kode-icons';
import { Box, Button, Grid, GridItem, Heading, Stack } from '@kadena/kode-ui';
import classNames from 'classnames';
import type { GetStaticProps } from 'next';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';

interface IProps {
  popularPages: IMostPopularPage[];
  changelogs: IChangelogPackage[];
}

const Home: FC<IProps> = ({ popularPages, changelogs }) => {
  return (
    <>
      <HomeHeader popularPages={popularPages} />
      <div
        className={classNames(contentClass, contentClassVariants.home)}
        id="maincontent"
      >
        <article className={articleClass}>
          <Box className={containerClass}>
            <Grid gap="lg" columns={{ sm: 1, md: 2 }}>
              <GridItem>
                <DocsCard
                  label="Quick start"
                  description="Start by setting up a local development environment with the tools you need to write a simple smart contract for the Kadena network."
                >
                  <BrowseSection marker="none">
                    <Link className={docsCardLink} href="/build/quickstart">
                      Quick start for Kadena developers
                    </Link>
                  </BrowseSection>
                </DocsCard>
              </GridItem>
              <GridItem>
                <DocsCard
                  label="Build"
                  description="Get started as a smart contract author or application builder with the Pact programming language, Kadena CLI, and Kadena client libraries."
                >
                  <BrowseSection marker="none">
                    <Link className={docsCardLink} href="/build/pact">
                      Get started
                    </Link>
                    <Link className={docsCardLink} href="/build/pact">
                      Develop using the Kadena CLI
                    </Link>
                    <Link
                      className={docsCardLink}
                      href="/build/deploy-first-contract"
                    >
                      Deploy your first contract
                    </Link>
                  </BrowseSection>
                </DocsCard>
              </GridItem>
              <GridItem>
                <DocsCard
                  label="API"
                  description="Use API endpoints to interact with smart contracts and connect to the Kadena blockchain."
                >
                  <BrowseSection marker="none">
                    <Link className={docsCardLink} href="/reference/rest-api">
                      Pact REST API
                    </Link>
                    <Link
                      className={docsCardLink}
                      href="/reference/chainweb-api"
                    >
                      Chainweb REST API
                    </Link>
                    <Link
                      className={docsCardLink}
                      href="/reference/kadena-client"
                    >
                      Kadena client libraries
                    </Link>
                  </BrowseSection>
                </DocsCard>
              </GridItem>
              <GridItem>
                <DocsCard
                  label="How-to guides"
                  description="Follow the examples in the How-to guides to learn how to perform common tasks."
                >
                  <BrowseSection marker="none">
                    <Link className={docsCardLink} href="/build/templates">
                      Create a new account
                    </Link>
                    <Link className={docsCardLink} href="/build/templates">
                      Get an account balance
                    </Link>

                    <Link className={docsCardLink} href="/build/templates">
                      Make a simple transfer
                    </Link>
                  </BrowseSection>
                </DocsCard>
              </GridItem>

              <GridItem rowSpan={1}>
                <DocsCard
                  label="Built-in functions"
                  description="Pact provides a large number of native built-in functions to handle different types of common tasks."
                >
                  <BrowseSection marker="none">
                    <Link
                      className={docsCardLink}
                      href="/reference/functions/general"
                    >
                      General purpose functions
                    </Link>
                    <Link
                      className={docsCardLink}
                      href="/reference/functions/database"
                    >
                      Database functions
                    </Link>
                    <Link
                      className={docsCardLink}
                      href="/reference/functions/time"
                    >
                      Time functions and formats
                    </Link>
                    <Link
                      className={docsCardLink}
                      href="/reference/functions/operators"
                    >
                      Operators
                    </Link>
                  </BrowseSection>
                </DocsCard>
              </GridItem>

              <GridItem>
                <DocsCard
                  label="Solutions showcase"
                  description="Explore Kadena tools and sample applications that illustrate what you can build with Kadena libraries and components."
                >
                  <BrowseSection marker="none">
                    <Link
                      className={docsCardLink}
                      href="https://tools.kadena.io"
                    >
                      Developer tools
                    </Link>
                    <Link className={docsCardLink} href="/build/nft-marmalade">
                      Non-fungible and poly-fungible tokens
                    </Link>
                    <Link className={docsCardLink} href="/build/authentication">
                      Authentication with Kadena SpireKey
                    </Link>
                    <Link className={docsCardLink} href="/build/frontend">
                      Kadena client libraries
                    </Link>
                  </BrowseSection>
                </DocsCard>
              </GridItem>
            </Grid>
          </Box>
          <Stack flexDirection="column" gap="xxxl">
            <BrowseSection
              title="Get started with Kadena today"
              direction="row"
            >
              <BrowseSection.LinkBlock
                title="Bootstrap Kadena dApp"
                subtitle="Quickstart your Kadena app"
                href="https://github.com/kadena-community/create-kadena-app"
              />

              <BrowseSection.LinkBlock
                title="Devnet Docker Container"
                subtitle="Run a chainweb-node instance for development"
                href="https://hub.docker.com/r/kadena/devnet"
              />

              <BrowseSection.LinkBlock
                title="Dev Wallet Chainweaver [web]"
                subtitle="Chainweaver on the web"
                href="https://chainweaver.kadena.network/"
              />

              <BrowseSection.LinkBlock
                title="Dev Wallet Chainweaver [desktop]"
                subtitle="Kadena Chainweaver desktop wallet"
                href="https://github.com/kadena-io/chainweaver/releases"
              />

              <BrowseSection.LinkBlock
                title="Pact binary"
                subtitle="Install Pact for yourself"
                href="https://github.com/kadena-io/pact#installing-pact"
              />
              <BrowseSection.LinkBlock
                title="Kadena.io"
                subtitle="Home is where the heart is"
                href="https://kadena.io"
              />
            </BrowseSection>

            <Stack flexDirection="column" gap="md">
              <Heading as="h5" transform="uppercase">
                Changelogs
              </Heading>
              <ChangelogTable changelogs={changelogs} />
              <Stack>
                <Link href={`/changelogs`} passHref legacyBehavior>
                  <Button variant="info" endVisual={<MonoList />}>
                    See all logs
                  </Button>
                </Link>
              </Stack>
            </Stack>
          </Stack>
        </article>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const newChangelogs = getPackages(
    changelogs as unknown as IChangelogComplete,
  ).map((pkg) => {
    const versions = getVersions(pkg);
    return {
      ...pkg,
      versionCount: versions.length,
      content: versions.slice(0, 1),
    };
  });

  return {
    props: {
      changelogs: newChangelogs,
      ...(await getPageConfig({
        popularPages: '/',
        filename: __filename,
      })),
      frontmatter: {
        title: 'Welcome to Kadena docs',
        menu: 'Pact',
        label: 'Pact Test',
        order: 1,
        description:
          'Welcome to the Kadena documentation site! This site provides documentation for all things Kadena, including general topics for learning about blockchain technology, technical references for developing smart contracts, and guides for becoming a ChainWeb node operator, using wallet applications, and creating tokens and token collections with Marmalade.',
        layout: 'home',
      },
    },
  };
};

export default Home;
