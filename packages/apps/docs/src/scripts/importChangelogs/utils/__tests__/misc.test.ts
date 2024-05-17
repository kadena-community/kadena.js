import fs from 'fs';
import { getChangelog, getPackages, getVersions, writeContent } from '../misc';

describe('misc utils', () => {
  describe('getChangelog', () => {
    beforeEach(() => {
      vi.mock('fs', async () => {
        const actual = (await vi.importActual('fs')) as {};
        return {
          default: {
            ...actual,
            readFileSync: (file: string) => {
              return 'By the power of Grayskull...I have the power!';
            },
          },
        };
      });
    });
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
  describe('getPackages', () => {
    it('should return all the packages of the complete json', async () => {
      const { default: changelog } = await import('./mock/changelog.json', {
        assert: {
          type: 'json',
        },
      });

      const result = getPackages(changelog as unknown as IChangelogComplete);
      expect(result.length).toEqual(6);
      expect(result[0].name).toEqual('Greyskull');
    });
  });

  describe('getVersions', () => {
    it('should return all the versions of a package', async () => {
      const { default: changelog } = await import('./mock/changelog.json', {
        assert: {
          type: 'json',
        },
      });

      const pkg = changelog['React UI'] as unknown as IChangelogPackage;
      const result = getVersions(pkg);

      expect(result.length).toEqual(16);
      expect(result[0].label).toEqual('0.9.0');
    });

    it('should return an empty array if there are no versions', async () => {
      const { default: changelog } = await import('./mock/changelog.json', {
        assert: {
          type: 'json',
        },
      });

      const pkg = changelog['No versions'] as unknown as IChangelogPackage;
      const result = getVersions(pkg);
      expect(result.length).toEqual(0);
    });
  });
});
