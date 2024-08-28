import { getChangelogs } from '../utils/getChangelogs';

const mocks = vi.hoisted(() => {
  return {
    REPOS: [
      {
        name: 'Kode UI Components',
        slug: 'kode-ui-components',
        repo: 'https://github.com/kadena-community/kadena.js.git',
        directory: '/packages/libs/kode-ui',
        fileName: 'CHANGELOG.md',
        owner: 'kadena-community',
        repoName: 'kadena.js',
      },
      {
        name: 'Kode Icons',
        slug: 'kode-icons',
        repo: 'https://github.com/kadena-community/kadena.js.git',
        directory: '/packages/libs/kode-icons',
        fileName: 'CHANGELOG.md',
        owner: 'kadena-community',
        repoName: 'kadena.js',
      },
      {
        name: 'KadenaJS',
        slug: 'kadenajs',
        repo: 'https://github.com/kadena-community/kadena.js.git',
        directory: '/packages/libs/kadena.js',
        fileName: 'CHANGELOG.md',
        owner: 'kadena-community',
        repoName: 'kadena.js',
      },
      {
        name: 'Pact 4',
        slug: 'pact',
        repo: 'https://github.com/kadena-io/pact.git',
        directory: '/',
        fileName: 'CHANGELOG.md',
        owner: 'kadena-io',
        repoName: 'pact',
      },
    ],
  };
});

describe('getChangelogs', () => {
  beforeEach(() => {
    vi.mock('@/scripts/importChangelogs/constants', async () => {
      const actual = (await vi.importActual(
        '@/scripts/importChangelogs/constants',
      )) as {};

      return {
        ...actual,
        REPOS: mocks.REPOS,
      };
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });
  it('should return an string of url strings for all repos', async () => {
    const { default: changelog } = await import(
      './../../__mocks__/changelog.json',
      {
        assert: {
          type: 'json',
        },
      }
    );

    const result = getChangelogs(
      '/changelogs',
      changelog as unknown as IChangelogComplete,
    );

    expect(result).toEqual(`
    <url>
        <loc>/changelogs/kode-ui-components</loc>
        <lastmod>2024-05-08</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1</priority>
    </url>
    <url>
        <loc>/changelogs/kode-icons</loc>
        <lastmod>2024-04-25</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1</priority>
    </url>
    <url>
        <loc>/changelogs/kadenajs</loc>
        <lastmod>2024-04-25</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1</priority>
    </url>
    <url>
        <loc>/changelogs/pact</loc>
        <lastmod>2024-05-21</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1</priority>
    </url>`);
  });
});
