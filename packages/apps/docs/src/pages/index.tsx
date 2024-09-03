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
                <Link className={docsCardLink} href="/quickstart">
                  <DocsCard label="Quick start"></DocsCard>
                </Link>
              </GridItem>
              <GridItem>
                <Link className={docsCardLink} href="/developers">
                  <DocsCard label="Developers"></DocsCard>
                </Link>
              </GridItem>
              <GridItem>
                <Link className={docsCardLink} href="/pow">
                  <DocsCard label="Proof-of-Work consensus"></DocsCard>
                </Link>
              </GridItem>
              <GridItem>
                <Link className={docsCardLink} href="/how-to">
                  <DocsCard label="How-to"></DocsCard>
                </Link>
              </GridItem>

              <GridItem rowSpan={1}>
                <Link className={docsCardLink} href="/api">
                  <DocsCard label="API"></DocsCard>
                </Link>
              </GridItem>

              <GridItem>
                <Link className={docsCardLink} href="/solutions">
                  <DocsCard label="Solutions showcase" />
                </Link>
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
