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
                  label="Engage"
                  description="Start here to learn the basics, including blockchain fundamentals and the core concepts of the Kadena network."
                >
                  <BrowseSection marker="none">
                    <Link
                      className={docsCardLink}
                      href="/learn/what-is-a-blockchain"
                    >
                      What is a blockchain?
                    </Link>

                    <Link className={docsCardLink} href="/learn/why-build">
                      Why build on a blockchain?
                    </Link>

                    <Link className={docsCardLink} href="/learn/why-kadena">
                      Why Kadena?
                    </Link>

                    <Link className={docsCardLink} href="/learn/accounts">
                      Accounts, keys, and principals
                    </Link>
                  </BrowseSection>
                </DocsCard>
              </GridItem>
              <GridItem>
                <DocsCard
                  label="Onboard"
                  description="Try Kadena as a first time user or start your journey as a developer with a guided tour."
                >
                  <BrowseSection marker="none">
                    <Link className={docsCardLink} href="/build/onboard">
                      Explore the blockchain
                    </Link>
                    <Link className={docsCardLink} href="/build/quickstart">
                      Deploy your first contract
                    </Link>
                    <Link className={docsCardLink} href="/build/pact">
                      Get started with Pact smart contract language
                    </Link>
                  </BrowseSection>
                </DocsCard>
              </GridItem>
              <GridItem>
                <DocsCard
                  label="Coach"
                  description="Take your game to the next level with tools, sample code, and how-to guides."
                >
                  <BrowseSection marker="none">
                    <Link className={docsCardLink} href="/build/pact">
                      Smart contracts
                    </Link>
                    <Link className={docsCardLink} href="/build/nft-marmalade">
                      Non-fungible tokens
                    </Link>
                    <Link className={docsCardLink} href="/build/templates">
                      Code templates
                    </Link>
                    <Link className={docsCardLink} href="/build/frontend">
                      Command-line interface
                    </Link>
                  </BrowseSection>
                </DocsCard>
              </GridItem>
              <GridItem>
                <DocsCard
                  label="Propel"
                  description="Deploy your smart contracts on the network or support the infrastructure by deploying a Chainweb node."
                >
                  <BrowseSection marker="none">
                    <Link className={docsCardLink} href="/deploy">
                      Prepare to deploy
                    </Link>
                    <Link
                      className={docsCardLink}
                      href="/deploy/chainweb-get-started"
                    >
                      Manage a Chainweb node
                    </Link>

                    <Link className={docsCardLink} href="/learn/chainweb">
                      Chainweb consensus protocol
                    </Link>
                    <Link className={docsCardLink} href="/reference/syntax">
                      Pact smart contract language
                    </Link>
                  </BrowseSection>
                </DocsCard>
              </GridItem>

              <GridItem rowSpan={1}>
                <DocsCard
                  label="Embrace"
                  description="Find out about community programs, grants, partnerships, and business development opportunities,
              to grow the Kadena ecosystem and how you can contribute."
                >
                  <BrowseSection marker="none">
                    <Link className={docsCardLink} href="/participate">
                      How to get involved
                    </Link>
                    <Link className={docsCardLink} href="/participate/docs">
                      Contribute to doc
                    </Link>

                    <Link
                      className={docsCardLink}
                      href="https://kadena.io/grants/"
                    >
                      Grants
                    </Link>
                  </BrowseSection>
                </DocsCard>
              </GridItem>

              <GridItem>
                <DocsCard
                  label="Explore beyond"
                  description="Explore videos, whitepapers, discussion forums, and other sites and tools that are outside the scope of documentation."
                >
                  <BrowseSection marker="none">
                    <Link
                      className={docsCardLink}
                      href="https://tools.kadena.io"
                    >
                      Get KDA and developer tools
                    </Link>
                    <Link
                      className={docsCardLink}
                      href="https://academy.kadena.io"
                    >
                      Sign up for the Kadena Academy
                    </Link>
                    <Link
                      className={docsCardLink}
                      href="https://www.youtube.com/kadenablockchain"
                    >
                      Visit the Kadena video library
                    </Link>
                    <Link
                      className={docsCardLink}
                      href="https://www.kadena.io/blog"
                    >
                      Read recent articles
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
