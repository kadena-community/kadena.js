import type { IBasePageMeta, IPageMeta } from '@kadena/docs-tools';

export const blogFrontMatter: IPageMeta = {
  wordCount: 779,
  readingTimeInMinutes: 4,
  editLink:
    'XXXX/packages/apps/docs/src/pages/blogchain/2018/the-evm-is-fundamentally-unsafe-2018-02-07.mdx',
  lastModifiedDate: new Date('2023-08-22T15:00:04.405Z'),
  navigation: {
    previous: {
      root: '/blogchain/2018/security-kadena-chainweb-blockchain-2018-11-01',
      title: "Security in Kadena's Public Blockchain",
    },
    next: {
      root: '/blogchain/2018/the-evm-is-fundamentally-unsafe-2018-12-13',
      title: 'The EVM Is Fundamentally Unsafe',
    },
  },
  title: 'Kadena The Next Generation Blockchain',
  description:
    "Kadena has a lot of exciting news and updates about our company, its technology, and what's on the horizon. We want to thank you all so much for your incredible enthusiasm and support! Here&apos;s what's gone down in the past few months",
  menu: 'Kadena The Next Generation Blockchain',
  label: 'Kadena The Next Generation Blockchain',
  publishDate: '2018-02-07T00:00:00.000Z',
  layout: 'full',
  order: 6,
};

export const fullLayoutFrontMatter: IPageMeta = {
  wordCount: 809,
  readingTimeInMinutes: 5,
  editLink: 'XXXX/packages/apps/docs/src/pages/kadena/overview.mdx',
  lastModifiedDate: new Date('2023-08-22T15:00:04.405Z'),
  navigation: {
    previous: {
      root: '/kadena',
      title: 'Intro to Kadena',
    },
    next: {
      root: '/kadena/kda',
      title: 'What is KDA?',
    },
  },
  title: 'Overview of Kadena',
  description: 'Kadena makes blockchain work for everyone.',
  menu: 'Kadena',
  label: 'Overview',
  order: 1,
  layout: 'full',
};

export const landingFrontMatter: IBasePageMeta = {
  title: 'Intro to Kadena',
  menu: 'Kadena',
  subTitle: 'Build the future on Kadena',
  label: 'Introduction',
  order: 0,
  description: 'Welcome to Kadena&apos;s documentation!',
  layout: 'landing',
};

export const redoclyFrontMatter: IPageMeta = {
  title: 'Chainweb',
  menu: 'Chainweb',
  subTitle: 'Be a part of our ecosystem',
  label: 'Chainweb',
  order: 5,
  description: 'Be a part of our ecosystem',
  layout: 'redocly',
  editLink: 'XXXX/packages/apps/docs/src/pages/kadena/overview.mdx',
  navigation: {
    previous: {
      root: '/kadena',
      title: 'Intro to Kadena',
    },
    next: {
      root: '/kadena/kda',
      title: 'What is KDA?',
    },
  },
};
