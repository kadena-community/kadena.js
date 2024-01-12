import { Heading2 } from '@/components/Markdown/Heading/Heading2';
import { Paragraph } from '@/components/Markdown/Paragraph/Paragraph';
import type { IPageProps } from '@kadena/docs-tools';
import type { Meta, StoryObj } from '@storybook/react';
import Link from 'next/link';
import React from 'react';
import { redoclyFrontMatter } from '../__fixtures__/frontmatter';
import { leftMenuTree } from '../__fixtures__/leftMenuTree';
import { Redocly } from './Redocly';

const meta: Meta<IPageProps> = {
  title: 'Layout/Redocly',
  component: Redocly,
};

export default meta;

type Story = StoryObj<IPageProps>;

const props: IPageProps = {
  headerMenuItems: leftMenuTree,
  frontmatter: redoclyFrontMatter,
  leftMenuTree: leftMenuTree,
  menuItems: [],
  aSideMenuTree: [],
  topDocs: [],
};

export const Default: Story = {
  name: 'Default',
  args: props,
  render: ({ frontmatter, leftMenuTree, headerMenuItems }) => (
    <div>
      <Redocly
        headerMenuItems={headerMenuItems}
        frontmatter={frontmatter}
        leftMenuTree={leftMenuTree}
        menuItems={[]}
        aSideMenuTree={[]}
        topDocs={[]}
      >
        <Heading2>Kadena: The Next Generation Blockchain</Heading2>
        <Paragraph>
          JANUARY 2018 ROUND UP — Kadena has a lot of exciting news and updates
          about our company, its technology, and what&apos;s on the horizon. We
          want to thank you all so much for your incredible enthusiasm and
          support! Here&apos;s what&apos;s gone down in the past few months:
        </Paragraph>
        <Heading2>Kadena raises $2.25M in first funding round</Heading2>
        <Paragraph>
          Kadena co-founders{' '}
          <Link href="http://kadena.io/#/team">Will Martino</Link>, and{' '}
          <Link href="http://kadena.io/#/team">Stuart Popejoy</Link>, announced
          that we raised $2.25M in our pre-A{'\n'}financing round. Major
          investors in the private-placement SAFT round included Metastable,
          Kilowatt Capital, Coinfund, and Multicoin Capital. Check out the{' '}
          <Link href="https://www.coindesk.com/jp-morgan-blockchain-spin-off-raises-2-25-million/">
            CoinDesk
          </Link>
          , article that launched a frenzy of interest and{' '}
          <Link href="http://kadena.io/docs/KadenaPR-1-31-2018.pdf">
            read our press release
          </Link>
          .
        </Paragraph>
      </Redocly>
    </div>
  ),
};
