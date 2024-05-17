import {
  filterCommitsWithoutData,
  getCommits,
  getVersionCommits,
} from '../commits';

describe('commits utils', () => {
  describe('getCommits', () => {
    it('should return an array with all commits', async () => {
      const changelog = await import('./mock/changelog.json', {
        assert: {
          type: 'json',
        },
      });
      const pkg = changelog.test as unknown as IChangelogPackage;

      const result = getCommits(pkg);
      expect(result.length).toEqual(26);
    });
    it('should return an array of commits', async () => {
      const changelog = await import('./mock/changelog.json', {
        assert: {
          type: 'json',
        },
      });

      const pkg = changelog.test as unknown as IChangelogPackage;
      const result = getCommits(pkg);

      expect(result[0].hash).toEqual('0ea2d14f7');
    });
  });
  describe('getVersionCommits', () => {
    it('should return an array with all commits', async () => {
      const changelog = await import('./mock/changelog.json', {
        assert: {
          type: 'json',
        },
      });
      const version = changelog.test.content[
        '1.0.0'
      ] as unknown as IChangelogPackageVersion;

      const result = getVersionCommits(version);
      expect(result.length).toEqual(6);
    });
    it('should return an array of commits', async () => {
      const changelog = await import('./mock/changelog.json', {
        assert: {
          type: 'json',
        },
      });
      const version = changelog.test.content[
        '1.0.0'
      ] as unknown as IChangelogPackageVersion;

      const result = getVersionCommits(version);

      expect(result[0].hash).toEqual('0ea2d14f7');
    });
  });

  describe('filterCommitsWithoutData', () => {
    beforeEach(() => {
      vi.mock('../../constants', () => {
        return {
          MAX_TRIES: 3,
        };
      });
    });
    it('should return false if the commit has tried 3 times already, but no data', () => {
      const commit = {
        hash: '93bf55b07',
        tries: 3,
      };

      expect(filterCommitsWithoutData(commit)).toEqual(false);
    });

    it('should return false if the commit has tried 2 times already, but there is data data', () => {
      const commit = {
        hash: '93bf55b07',
        tries: 2,
        data: {} as IChangelogCommitData,
      };

      expect(filterCommitsWithoutData(commit)).toEqual(false);
    });

    it('should return true if the commit has tried 1 times and there is no data ', () => {
      const commit = {
        hash: '93bf55b07',
        tries: 1,
      };

      expect(filterCommitsWithoutData(commit)).toEqual(true);
    });
  });
});
