import { Box, Button, Grid, Heading, Stack } from '@kadena/react-ui';

import { BlogPostsStrip } from '@/components/BlogPostsStrip/BlogPostsStrip';
import { BrowseSection } from '@/components/BrowseSection/BrowseSection';
import { DocsCard } from '@/components/DocsCard/DocsCard';
import { docsCardLink } from '@/components/DocsCard/styles.css';
import {
  articleClass,
  contentClass,
  contentClassVariants,
} from '@/components/Layout/components/articleStyles.css';
import { HomeHeader } from '@/components/Layout/Landing/components';
import type { IMenuData } from '@/Layout';
import type { IMostPopularPage } from '@/MostPopularData';
import { getBlogPosts } from '@/utils/getBlogPosts';
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
  blogPosts: IMenuData[];
}

const Home: FC<IProps> = ({ popularPages, blogPosts }) => {
  return (
    <>
      <HomeHeader popularPages={popularPages} />
      <div
        className={classNames(contentClass, contentClassVariants.home)}
        id="maincontent"
      >
        <article className={classNames(articleClass)}>
          <Box marginBottom="$20">
            <Grid.Root gap="$lg" columns={{ sm: 1, md: 2 }}>
              <Grid.Item rowSpan={2}>
                <DocsCard
                  label="Introduction"
                  description="Kadena is the only platform offering a complete decentralized infrastructure for builders. Combining a revolutionary chain architecture with the tools needed for widespread adoption, your teams get the full capabilities of blockchain with the ability to go from concept to launch in days vs. months by not having to build from scratch. Learn about our core concepts."
                  schema="info"
                  background="whitepapers"
                >
                  <BrowseSection marker="none">
                    <Link className={docsCardLink} href="/kadena/overview">
                      What is the Kadena Blockchain?
                    </Link>
                    <Link className={docsCardLink} href="/kadena/kda">
                      What is KDA token?
                    </Link>
                    <Link className={docsCardLink} href="/pact">
                      What are Pact smart contracts?
                    </Link>
                  </BrowseSection>
                </DocsCard>
              </Grid.Item>
              <Grid.Item>
                <DocsCard
                  label="Learn through tutorials"
                  description="Find training and documentation and discover resources to assist you in learning. Whether you are just starting or an experienced professional, our hands-on approach helps you reach your goals faster, more confidently, and at your own pace."
                  schema="warning"
                  background="contribute"
                >
                  <Box marginY="$4">
                    <Button
                      as="a"
                      href="/build/guides/election-dapp-tutorial"
                      icon="TrailingIcon"
                      color="negative"
                    >
                      Build your first dApp
                    </Button>
                  </Box>
                  <BrowseSection marker="none">
                    <Link className={docsCardLink} href="/build/quickstart">
                      10 minute quick start
                    </Link>

                    <a
                      className={docsCardLink}
                      href="https://academy.kadena.io"
                    >
                      Learn on the Academy
                    </a>
                    <Link className={docsCardLink} href="/build/guides">
                      Create a Smart Contract
                    </Link>
                  </BrowseSection>
                </DocsCard>
              </Grid.Item>
              <Grid.Item>
                <DocsCard
                  label="Setup"
                  description="Use the right tools and platforms for building many types of decentralized applications."
                  schema="success"
                  background="quickstart"
                >
                  <BrowseSection marker="none">
                    <Link
                      className={docsCardLink}
                      href="/kadena/wallets/chainweaver"
                    >
                      Development wallet
                    </Link>
                    <Link
                      className={docsCardLink}
                      href="/contribute/ambassadors"
                    >
                      Local devnet
                    </Link>
                    <Link
                      className={docsCardLink}
                      href="/pact/beginner/test-in-the-sdk"
                    >
                      Pact REPL
                    </Link>
                    <Link className={docsCardLink} href="/pact/vscode">
                      Visual Studio Code
                    </Link>
                  </BrowseSection>
                </DocsCard>
              </Grid.Item>
            </Grid.Root>
          </Box>

          <Stack direction="column" gap="$3xl">
            <BrowseSection title="Useful tools" direction="row">
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
            </BrowseSection>

            <BrowseSection title="General" direction="row">
              <BrowseSection.LinkBlock
                title="Overview of Kadena"
                subtitle="Find out what we are about"
                href="/kadena"
              />
              <BrowseSection.LinkBlock
                title="Manage your KDA"
                subtitle="Wallets & patforms"
                href="/kadena/kda/manage-kda"
              />
              <BrowseSection.LinkBlock
                title="Kadena.io"
                subtitle="Home is where the heart is"
                href="https://kadena.io"
              />
            </BrowseSection>

            <BrowseSection title="Programs" direction="row">
              <BrowseSection.LinkBlock
                title="Ambassador program"
                subtitle="Apply for some Ambassador privileges"
                href="/contribute/ambassadors"
              />
              <BrowseSection.LinkBlock
                title="Technical grants"
                subtitle="Empowering builders for innovation"
                href="https://kadena.io/grants/"
              />
              <BrowseSection.LinkBlock
                title="Docs"
                subtitle="Help to improve our docs"
                href="/contribute/contribute"
              />
            </BrowseSection>

            <Box>
              <Heading as="h5">Stay up-to-date</Heading>
              <BlogPostsStrip
                data={blogPosts}
                link="/blogchain"
                linkLabel="More Blogchain posts"
              />
            </Box>

            <BrowseSection title="General" direction="row">
              <BrowseSection.LinkBlock
                title="Overview of Pact"
                subtitle="Learn the basics of Pact to create a smart contract"
                href="/pact"
              />
              <BrowseSection.LinkBlock
                title="Chainweb"
                subtitle="Chainweb is our scalable Proof-Of-Work (PoW) consensus algorithm"
                href="/chainweb"
              />
              <BrowseSection.LinkBlock
                title="Marmalade"
                subtitle="Marmalade provides the complete NFT infrastructure."
                href="/marmalade"
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
  const blogPosts = await getBlogPosts();

  return {
    props: {
      popularPages: mostPopularPages,
      blogPosts,
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
