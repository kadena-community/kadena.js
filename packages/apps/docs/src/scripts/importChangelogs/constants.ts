import 'dotenv/config';

export const errors: string[] = [];
export const success: string[] = [];
export const CHANGELOGFILENAME = './src/data/changelogs.json';
export const MAX_TRIES = 3;
export const MAXCALLS = 300;

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
    name: 'React UI',
    repo: 'https://github.com/kadena-community/kadena.js.git',
    directory: '/packages/libs/react-ui',
    fileName: 'CHANGELOG.md',
    owner: 'kadena-community',
    repoName: 'kadena.js',
  },
  {
    name: 'KadenaJS',
    repo: 'https://github.com/kadena-community/kadena.js.git',
    directory: '/packages/libs/kadena.js',
    fileName: 'CHANGELOG.md',
    owner: 'kadena-community',
    repoName: 'kadena.js',
  },
  {
    name: 'Pact 4',
    repo: 'https://github.com/kadena-io/pact.git',
    directory: '/',
    fileName: 'CHANGELOG.md',
    owner: 'kadena-io',
    repoName: 'pact',
  },
];
