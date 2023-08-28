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
      title: 'Security in Kadena&apos;s Public Blockchain',
    },
    next: {
      root: '/docs/blogchain/2018/the-evm-is-fundamentally-unsafe-2018-12-13',
      title: 'The EVM Is Fundamentally Unsafe',
    },
  },
  title: 'Kadena The Next Generation Blockchain',
  description:
    'Kadena has a lot of exciting news and updates about our company, its technology, and what&apos;s on the horizon. We want to thank you all so much for your incredible enthusiasm and support! Here&apos;s what&apos;s gone down in the past few months',
  menu: 'Kadena The Next Generation Blockchain',
  label: 'Kadena The Next Generation Blockchain',
  publishDate: '2018-02-07T00:00:00.000Z',
  author: 'Vivienne Chen',
  layout: 'blog',
};

export const fullLayoutType: IPageMeta = {
  wordCount: 1053,
  readingTimeInMinutes: 6,
  editLink: 'XXXX/packages/apps/docs/src/pages/docs/build/quickstart.mdx',
  lastModifiedDate: new Date('2023-08-22T15:00:04.452Z'),
  navigation: {
    previous: {
      root: '/docs/build',
      title: 'Build on Kadena',
    },
    next: {
      root: '/docs/build/tools',
      title: 'Useful Tools',
    },
  },
  title: 'Kadena Quickstart',
  description:
    "Learn Kadena's core concepts & tools for development in 15 minutes",
  menu: 'Build',
  label: 'Quickstart',
  order: 1,
  layout: 'full',
};
