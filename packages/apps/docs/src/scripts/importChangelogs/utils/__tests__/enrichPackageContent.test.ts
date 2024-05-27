import { getAuthors, getLastModifiedDate } from '../enrichPackageContent';

describe('enrichPackageContent', () => {
  describe('getAuthors', () => {
    it('should enrich the version with all authors from the commits', async () => {
      const { default: changelog } = await import(
        './../../../__mocks__/changelog-notenriched.json',
        {
          assert: {
            type: 'json',
          },
        }
      );

      const version = changelog['react-ui'].content[
        '0.2.0'
      ] as unknown as IChangelogPackageVersion;

      const result = getAuthors(version);

      expect(result.length).toEqual(8);
      expect(result[0].login).toEqual('skeletor');
    });

    it('should enrich the version with all authors from the prs', async () => {
      const { default: changelog } = await import(
        './../../../__mocks__/changelog-notenriched.json',
        {
          assert: {
            type: 'json',
          },
        }
      );

      const version = changelog.pact.content[
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
        './../../../__mocks__/changelog-notenriched.json',
        {
          assert: {
            type: 'json',
          },
        }
      );

      const version = changelog['react-ui'].content[
        '0.2.0'
      ] as unknown as IChangelogPackageVersion;
      const result = getLastModifiedDate(version);

      expect(result).toEqual(new Date('2023-10-24T09:41:45.000Z'));
    });

    it('should enrich the version with the latest date that are in the PRs', async () => {
      const { default: changelog } = await import(
        './../../../__mocks__/changelog-notenriched.json',
        {
          assert: {
            type: 'json',
          },
        }
      );

      const version = changelog.pact.content[
        '4.6.0'
      ] as unknown as IChangelogPackageVersion;
      const result = getLastModifiedDate(version);

      expect(result).toEqual(new Date('2024-05-21T08:58:02.000Z'));
    });
  });
});
