import type { IMenuData } from '@kadena/docs-tools';
import { URL } from '../utils/constants';
import { getPosts } from '../utils/getPosts';

describe('getPosts', () => {
  it('should return a string of all posts urls', async () => {
    const posts: IMenuData[] = [
      {
        root: '/reference/functions/keysets',
        lastModifiedDate: new Date('Fri, 24 May 2024 11:10:53 GMT'),
        title: 'Keysets',
        description:
          'This document is a reference for the Pact smart-contract language, designed for correct, transactional execution on a high-performance blockchain.',
        menu: 'Keysets',
        label: 'Keysets',
        order: 5,
        layout: 'full',
        tags: ['pact', 'language reference', 'keysets'],
        wordCount: 233,
        readingTimeInMinutes: 2,
        isMenuOpen: false,
        isActive: false,
        children: [],
      },
      {
        root: '/reference/functions/operators',
        lastModifiedDate: new Date('Mon, 24 April 2023 11:10:53 GMT'),
        title: 'Operators',
        description:
          'This document is a reference for the Pact smart-contract language, designed for correct, transactional execution on a high-performance blockchain.',
        menu: 'Operators',
        label: 'Operators',
        order: 4,
        layout: 'full',
        tags: ['pact', 'language reference', 'operators'],
        wordCount: 1041,
        readingTimeInMinutes: 6,
        isMenuOpen: false,
        isActive: false,
        children: [],
      },
    ];

    const result = getPosts(URL, posts);

    expect(result).toEqual(`
      <url>
        <loc>https://docs.kadena.io/reference/functions/keysets</loc>
        <lastmod>2024-05-24</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1</priority>
      </url>
      <url>
        <loc>https://docs.kadena.io/reference/functions/operators</loc>
        <lastmod>2023-04-24</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1</priority>
      </url>`);
  });
});
