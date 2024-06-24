import fs from 'fs';
import { CURRENTPACKAGE } from '../../constants';
import { getChangelog, writeContent } from '../content';

describe('content utils', () => {
  beforeEach(() => {
    vi.mock('fs', async () => {
      const actual = (await vi.importActual('fs')) as {};
      return {
        default: {
          ...actual,
          writeFileSync: (file: string) => {},
          readFileSync: (file: string) => {
            return 'By the power of Grayskull...I have the power!';
          },
        },
      };
    });
  });
  afterEach(() => {
    vi.resetAllMocks();
  });
  describe('getChangelog', () => {
    it('should get the CHANGELOGTEMP.md when the repo is for Chainweb Node', () => {
      //this is temporary, until Chainweb Node gets the changelog file , just right
      const spy = vi.spyOn(fs, 'readFileSync');

      const repo: IRepo = {
        name: 'Chainweb Node',
        slug: 'chainweb-node',
        repo: 'https://github.com/kadena-io/chainweb-node.git',
        directory: '/',
        fileName: 'CHANGELOG.md',
        owner: 'kadena-io',
        repoName: 'chainweb-node',
      };

      getChangelog(repo);

      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith(`${process.cwd()}/CHANGELOGTEMP.md`, 'utf-8');
    });
    it('should read the content of a changelog from a repo', () => {
      const spy = vi.spyOn(fs, 'readFileSync');

      const repo: IRepo = {
        name: 'Pact 4',
        slug: 'pact',
        repo: 'https://github.com/kadena-io/pact.git',
        directory: '/',
        fileName: 'CHANGELOG.md',
        owner: 'kadena-io',
        repoName: 'pact',
      };

      getChangelog(repo);

      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith(
        './.tempimport/kadena-io/pact.git//CHANGELOG.md',
        'utf-8',
      );
    });

    it('should read the content of a changelog from the branch if repo name is same as branch', () => {
      const spy = vi.spyOn(fs, 'readFileSync');

      const repo: IRepo = {
        name: 'React UI',
        slug: 'react-ui',
        repo: 'https://github.com/kadena-community/kadena.js.git',
        directory: '/packages/libs/react-ui',
        fileName: 'CHANGELOG.md',
        owner: 'kadena-community',
        repoName: CURRENTPACKAGE,
      };

      getChangelog(repo);

      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith(
        `${process.cwd()}/../../../packages/libs/react-ui/CHANGELOG.md`,
        'utf-8',
      );
    });
  });
  describe('writeContent', () => {
    it('should write the content', () => {
      const spy = vi.spyOn(fs, 'writeFileSync');
      const content = {
        Pact: {
          name: 'pact',
        },
      } as unknown as IChangelogComplete;
      writeContent(content);
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith(
        './src/data/changelogs.json',
        JSON.stringify(content, null, 2),
      );
    });
  });
});
