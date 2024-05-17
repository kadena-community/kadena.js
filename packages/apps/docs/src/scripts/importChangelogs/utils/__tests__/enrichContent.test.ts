import { getAuthors, getLastModifiedDate } from '../enrichContent';

describe('enrichContent', () => {
  describe('getAuthors', () => {
    it('should enrich the version with all authors from the commits', async () => {
      const { default: changelog } = await import(
        './mock/changelog-notenriched.json',
        {
          assert: {
            type: 'json',
          },
        }
      );

      const version = changelog['React UI'].content[
        '0.2.0'
      ] as unknown as IChangelogPackageVersion;

      const result = getAuthors(version);

      expect(result.length).toEqual(8);
      expect(result[0].login).toEqual('skeletor');
    });

    it('should enrich the version with all authors from the prs', async () => {
      const { default: changelog } = await import(
        './mock/changelog-notenriched.json',
        {
          assert: {
            type: 'json',
          },
        }
      );

      const version = changelog['Pact 4'].content[
        '4.6.0'
      ] as unknown as IChangelogPackageVersion;

      const result = getAuthors(version);

      expect(result.length).toEqual(7);
      expect(result[0].login).toEqual('he-man');
    });
  });
  describe('getLastModifiedDate', () => {
    it('should enrich the version with the latest date that are in the commits', async () => {
      const { default: changelog } = await import(
        './mock/changelog-notenriched.json',
        {
          assert: {
            type: 'json',
          },
        }
      );

      const version = changelog['React UI'].content[
        '0.2.0'
      ] as unknown as IChangelogPackageVersion;
      const result = getLastModifiedDate(version);

      expect(result).toEqual(new Date('2023-10-24T09:41:45.000Z'));
    });

    it('should enrich the version with the latest date that are in the PRs', async () => {
      const { default: changelog } = await import(
        './mock/changelog-notenriched.json',
        {
          assert: {
            type: 'json',
          },
        }
      );

      const version = changelog['Pact 4'].content[
        '4.6.0'
      ] as unknown as IChangelogPackageVersion;
      const result = getLastModifiedDate(version);

      expect(result).toEqual(new Date('2024-05-17T06:36:10.000Z'));
    });
  });
});
