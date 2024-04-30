import type { IMostPopularPage } from '@/MostPopularData';
import { BlogPostsStrip } from '@/components/BlogPostsStrip/BlogPostsStrip';
import { BrowseSection } from '@/components/BrowseSection/BrowseSection';
import { DocsCard } from '@/components/DocsCard/DocsCard';
import { docsCardLink } from '@/components/DocsCard/styles.css';
import { HomeHeader } from '@/components/Layout/Landing/components';
import {
  articleClass,
  containerClass,
  contentClass,
  contentClassVariants,
} from '@/components/Layout/components/articleStyles.css';
import { getPageConfig } from '@/utils/config';
import type { IMenuData } from '@kadena/docs-tools';
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Link as KandenaLink,
  Stack,
  SystemIcon,
} from '@kadena/react-ui';
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
        <article className={articleClass}>
          <Box className={containerClass}>
            <Grid gap="lg" columns={{ sm: 1, md: 2 }}>
              <GridItem rowSpan={2}>
                <DocsCard
                  label="Start with core concepts"
                  description="Kadena is a secure and decentralized public blockchain with a revolutionary chain architecture and the tools designed for builders to get the results they expect, faster. If you want to build better user experiences and more diverse applications for blockchain adoption, explore Kadena. From core concepts to developer tooling, Kadena provides everything you need to develop blockchain applications—from concept to launch—in days or weeks instead of months or years."
                  schema="info"
                  background="whitepapers"
                >
                  <BrowseSection marker="none">
                    <Link className={docsCardLink} href="/kadena/why-kadena">
                      What is Kadena?
                    </Link>
                    <Link className={docsCardLink} href="/kadena/kda">
                      What is the KDA token?
                    </Link>
                    <Link className={docsCardLink} href="/pact">
                      What are Pact smart contracts?
                    </Link>
                  </BrowseSection>
                </DocsCard>
              </GridItem>
              <GridItem>
                <DocsCard
                  label="Learn step-by-step in tutorials"
                  description="Get hands-on experience and step-by-step instructions to start your journey from Hello, World! to smart contracts and full stack applications. Whether you are just starting out or an experienced professional, follow simple tutorials and in-depth workshops to reach your goals at your own pace."
                  schema="warning"
                  background="contribute"
                >
                  <Box marginBlock="md">
                    <KandenaLink
                      href="/build/guides/election-dapp-tutorial"
                      endVisual={<SystemIcon.TrailingIcon />}
                      variant="negative"
                    >
                      Build your first dApp
                    </KandenaLink>
                  </Box>
                  <BrowseSection marker="none">
                    <Link className={docsCardLink} href="/build/quickstart">
                      Quick start
                    </Link>

                    <a
                      className={docsCardLink}
                      href="https://academy.kadena.io"
                    >
                      Explore courses in the Kadena Academy
                    </a>
                    <Link className={docsCardLink} href="/build/guides">
                      Create a smart contract
                    </Link>
                  </BrowseSection>
                </DocsCard>
              </GridItem>
              <GridItem>
                <DocsCard
                  label="Set up your development environment"
                  description="If you're ready to start coding, you'll want to set up a local development environment with the tools and resources you'll need to build decentralized applications."
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
                      Local development network
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
              </GridItem>
            </Grid>
          </Box>

          <Stack flexDirection="column" gap="xxxl">
            <BrowseSection title="Download useful tools" direction="row">
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

            <BrowseSection title="Explore core components" direction="row">
              <BrowseSection.LinkBlock
                title="Overview of Kadena"
                subtitle="Find out what we are about"
                href="/kadena"
              />
              <BrowseSection.LinkBlock
                title="Manage your KDA"
                subtitle="Wallets & platforms"
                href="/kadena/kda/manage-kda"
              />
              <BrowseSection.LinkBlock
                title="Kadena.io"
                subtitle="Home is where the heart is"
                href="https://kadena.io"
              />
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

            <BrowseSection title="Participate in programs" direction="row">
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
                href="/contribute/docs"
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
          </Stack>
        </article>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      ...(await getPageConfig({
        blogPosts: true,
        popularPages: '/',
        filename: __filename,
      })),
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
