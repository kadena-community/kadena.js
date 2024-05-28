import fs from 'fs';
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
    it('should read the content of a changelog', () => {
      const spy = vi.spyOn(fs, 'readFileSync');

      const repo: IRepo = {
        name: 'Pact 4',
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
