import 'dotenv/config';

export const errors: string[] = [];
export const success: string[] = [];
export const CHANGELOGFILENAME = './src/data/changelogs.json';
export const MAX_TRIES = 1;
export const MAXCALLS = 300;
export const CURRENTPACKAGE = 'kadena.js';

export enum VersionPosition {
  PACKAGE = 0,
  VERSION = 1,
  PATCH = 2,
  MINOR = 3,
  MISC = 4,
}

// TODO: we should add this to the config.yaml
export const REPOS: IRepo[] = [
  {
    name: 'Kode UI Components',
    slug: 'kode-ui-components',
    repo: 'https://github.com/kadena-community/kadena.js.git',
    directory: '/packages/libs/react-ui',
    fileName: 'CHANGELOG.md',
    owner: 'kadena-community',
    repoName: 'kadena.js',
  },
  {
    name: 'Kode Icons',
    slug: 'kode-icons',
    repo: 'https://github.com/kadena-community/kadena.js.git',
    directory: '/packages/libs/react-icons',
    fileName: 'CHANGELOG.md',
    owner: 'kadena-community',
    repoName: 'kadena.js',
  },
  {
    name: 'Kadena Cli',
    slug: 'kadena-cli',
    repo: 'https://github.com/kadena-community/kadena.js.git',
    directory: '/packages/tools/kadena-cli',
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
  {
    name: 'Chainweb Node',
    slug: 'chainweb-node',
    repo: 'https://github.com/kadena-io/chainweb-node.git',
    directory: '/',
    fileName: 'CHANGELOG.md',
    owner: 'kadena-io',
    repoName: 'chainweb-node',
  },
];
