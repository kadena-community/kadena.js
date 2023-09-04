import { fullLayoutFrontMatter } from '../__fixtures__/frontmatter';
import { fullLayoutLeftMenuTree } from '../__fixtures__/leftMenuTree';

import { Full } from './Full';

import { Heading2 } from '@/components/Markdown/Heading';
import { Paragraph } from '@/components/Markdown/Paragraph';
import { IPageProps, TagNameType } from '@/types/Layout';
import { Meta, StoryObj } from '@storybook/react';
import Link from 'next/link';
import React from 'react';

const meta: Meta<IPageProps> = {
  title: 'Layout/Full',
  component: Full,
};

export default meta;

type Story = StoryObj<IPageProps>;

const aSideMenuTree = [
  {
    depth: 2,
    tag: 'h2' as unknown as TagNameType,
    title: 'Kadena: The Next Generation Blockchain',
    children: [
      {
        depth: 3,
        tag: 'h3' as unknown as TagNameType,
        title: 'Kadena raises $2.25M in first funding round',
        children: [],
        index: 1,
        parentTitle: 'Kadena: The Next Generation Blockchain',
      },
    ],
    index: 0,
    parentTitle: '',
  },
];

const props: IPageProps = {
  frontmatter: fullLayoutFrontMatter,
  leftMenuTree: fullLayoutLeftMenuTree,
  menuItems: [],
  aSideMenuTree: aSideMenuTree,
  topDocs: [],
};

export const Default: Story = {
  name: 'Default',
  args: props,
  render: ({ frontmatter, leftMenuTree, aSideMenuTree }) => (
    <div>
      <Full
        frontmatter={frontmatter}
        leftMenuTree={leftMenuTree}
        menuItems={[]}
        aSideMenuTree={aSideMenuTree}
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
      </Full>
    </div>
  ),
};
