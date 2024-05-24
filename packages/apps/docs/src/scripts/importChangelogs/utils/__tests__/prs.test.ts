import { filterPRsWithoutData, getPrId, getPrs, getVersionPRs } from '../prs';

describe('pr utils', () => {
  describe('getPrId', () => {
    it('should return the prID from the content with at start and label cleaned', () => {
      const content = 'Support for hyperlane-message-id (#1335)';
      const result = getPrId(content);

      expect(result.label).toEqual('Support for hyperlane-message-id');
      expect(result.prIds[0].tries).toEqual(0);
      expect(result.prIds[0].id).toEqual(1335);
      expect(result.commits.length).toEqual(0);
    });

    it('should return the multiple commits between the brackets', () => {
      const content = 'Support for verifier plugins (#1324,#1336)';
      const result = getPrId(content);

      expect(result.label).toEqual('Support for verifier plugins');
      expect(result.prIds.length).toEqual(2);
      expect(result.prIds[0].id).toEqual(1324);
      expect(result.prIds[1].id).toEqual(1336);
      expect(result.commits.length).toEqual(0);
    });

    it('should return the multiple commits between the brackets', () => {
      const content =
        'Fixed issue with the hash of cap guards, hash native and principals (#1273) (#1278) (#1287)';
      const result = getPrId(content);

      expect(result.label).toEqual(
        'Fixed issue with the hash of cap guards, hash native and principals',
      );
      expect(result.prIds.length).toEqual(3);
      expect(result.prIds[0].id).toEqual(1273);
      expect(result.prIds[1].id).toEqual(1278);
      expect(result.prIds[2].id).toEqual(1287);
      expect(result.commits.length).toEqual(0);
    });

    it('should return when there is no commit found', () => {
      const content = 'I have the powerrrrr';
      const result = getPrId(content);

      expect(result.label).toEqual('I have the powerrrrr');
      expect(result.commits.length).toEqual(0);
    });
  });

  describe('getPrs', () => {
    it('should return an array with all prs of given package', async () => {
      const { default: changelog } = await import(
        './../../../__mocks__/changelog.json',
        {
          assert: {
            type: 'json',
          },
        }
      );

      const pkg = changelog['Pact 4'] as unknown as IChangelogPackage;

      const result = getPrs(pkg);
      expect(result.length).toEqual(185);
    });
    it('should return an array of prs of given package first version', async () => {
      const { default: changelog } = await import(
        './../../../__mocks__/changelog.json',
        {
          assert: {
            type: 'json',
          },
        }
      );

      const pkg = changelog['Pact 4'] as unknown as IChangelogPackage;
      const result = getPrs(pkg);

      expect(result[0].id).toEqual(1326);
    });
  });

  describe('getVersionPRs', () => {
    it('should return an array with all commits of given version', async () => {
      const { default: changelog } = await import(
        './../../../__mocks__/changelog.json',
        {
          assert: {
            type: 'json',
          },
        }
      );

      const version = changelog.pact.content[
        '4.11.0'
      ] as unknown as IChangelogPackageVersion;

      const result = getVersionPRs(version);
      expect(result.length).toEqual(10);
    });
    it('should return an array of commits', async () => {
      const { default: changelog } = await import(
        './../../../__mocks__/changelog.json',
        {
          assert: {
            type: 'json',
          },
        }
      );
      const version = changelog.pact.content[
        '4.11.0'
      ] as unknown as IChangelogPackageVersion;

      const result = getVersionPRs(version);

      expect(result[0].id).toEqual(1326);
    });
  });
  describe('filterPRsWithoutData', () => {
    beforeEach(() => {
      vi.mock('../../constants', () => {
        return {
          MAX_TRIES: 3,
        };
      });
    });
    it('should return false if the commit has tried 3 times already, but no data', () => {
      const pr = {
        id: 1337,
        tries: 3,
        commits: [],
      };

      expect(filterPRsWithoutData(pr)).toEqual(false);
    });

    it('should return false if the commit has tried 2 times already, but there is data', () => {
      const pr = {
        id: 1337,
        tries: 2,
        commits: [],
        data: {} as IChangelogPRData,
      };

      expect(filterPRsWithoutData(pr)).toEqual(false);
    });

    it('should return true if the commit has tried 1 time and there is no data ', () => {
      const pr = {
        id: 1337,
        tries: 1,
        commits: [],
      };

      expect(filterPRsWithoutData(pr)).toEqual(true);
    });
  });
});
