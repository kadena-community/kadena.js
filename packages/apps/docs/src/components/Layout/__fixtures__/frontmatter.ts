import { IPageMeta } from '@/types/Layout';

export const blogFrontMatter: IPageMeta = {
  wordCount: 779,
  readingTimeInMinutes: 4,
  editLink:
    'XXXX/packages/apps/docs/src/pages/docs/blogchain/2018/the-evm-is-fundamentally-unsafe-2018-02-07.mdx',
  lastModifiedDate: new Date('2023-08-22T15:00:04.405Z'),
  navigation: {
    previous: {
      root: '/docs/blogchain/2018/security-kadena-chainweb-blockchain-2018-11-01',
      title: "Security in Kadena's Public Blockchain",
    },
    next: {
      root: '/docs/blogchain/2018/the-evm-is-fundamentally-unsafe-2018-12-13',
      title: 'The EVM Is Fundamentally Unsafe',
    },
  },
  title: 'Kadena The Next Generation Blockchain',
  description:
    "Kadena has a lot of exciting news and updates about our company, its technology, and what's on the horizon. We want to thank you all so much for your incredible enthusiasm and support! Here&apos;s what's gone down in the past few months",
  menu: 'Kadena The Next Generation Blockchain',
  label: 'Kadena The Next Generation Blockchain',
  publishDate: '2018-02-07T00:00:00.000Z',
  author: 'Vivienne Chen',
  layout: 'blog',
};

export const fullLayoutFrontMatter: IPageMeta = {
  wordCount: 809,
  readingTimeInMinutes: 5,
  editLink: 'XXXX/packages/apps/docs/src/pages/docs/kadena/overview.mdx',
  lastModifiedDate: new Date('2023-08-22T15:00:04.405Z'),
  navigation: {
    previous: {
      root: '/docs/kadena',
      title: 'Intro to Kadena',
    },
    next: {
      root: '/docs/kadena/kda',
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
