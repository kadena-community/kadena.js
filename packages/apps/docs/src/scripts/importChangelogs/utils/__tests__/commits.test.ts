import {
  filterCommitsWithoutData,
  getCommitId,
  getCommits,
  getVersionCommits,
} from '../commits';

describe('commits utils', () => {
  describe('getCommitId', () => {
    it('should return the commitId from the content with at start and label cleaned', () => {
      const content = 'b06929dcc: Added proper sizes for the dialog';
      const result = getCommitId(content);

      expect(result.label).toEqual('Added proper sizes for the dialog');
      expect(result.commits[0].tries).toEqual(0);
      expect(result.commits[0].hash).toEqual('b06929dcc');
      expect(result.prIds.length).toEqual(0);
    });

    it('should return the commitId from the content with brackets and label cleaned', () => {
      const content = 'update style notification [134666df3]';
      const result = getCommitId(content);

      expect(result.label).toEqual('update style notification');
      expect(result.commits[0].tries).toEqual(0);
      expect(result.commits[0].hash).toEqual('134666df3');
    });

    it('should return when there is no commit found', () => {
      const content = 'I have the powerrrrr';
      const result = getCommitId(content);

      expect(result.label).toEqual('I have the powerrrrr');
      expect(result.commits.length).toEqual(0);
    });
  });

  describe('getCommits', () => {
    it('should return an array with all commits of the given package', async () => {
      const changelog = await import('./../../../__mocks__/changelog.json', {
        assert: {
          type: 'json',
        },
      });
      const pkg = changelog.test as unknown as IChangelogPackage;

      const result = getCommits(pkg);
      expect(result.length).toEqual(26);
    });
    it('should return an array of commits of the given package first version', async () => {
      const changelog = await import('./../../../__mocks__/changelog.json', {
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
    it('should return an array with all commits of the given version', async () => {
      const changelog = await import('./../../../__mocks__/changelog.json', {
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
      const changelog = await import('./../../../__mocks__/changelog.json', {
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

    it('should return false if the commit has tried 2 times already, but there is data', () => {
      const commit = {
        hash: '93bf55b07',
        tries: 2,
        data: {} as IChangelogCommitData,
      };

      expect(filterCommitsWithoutData(commit)).toEqual(false);
    });

    it('should return true if the commit has tried 1 time and there is no data ', () => {
      const commit = {
        hash: '93bf55b07',
        tries: 1,
      };

      expect(filterCommitsWithoutData(commit)).toEqual(true);
    });
  });
});
