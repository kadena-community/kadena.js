import { getPackages, getVersions } from '../misc';

describe('misc utils', () => {
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

  describe('getPackages', () => {
    it('should return all the packages of the complete json', async () => {
      const { default: changelog } = await import('./mock/changelog.json', {
        assert: {
          type: 'json',
        },
      });

      const result = getPackages(changelog as unknown as IChangelogComplete);
      expect(result.length).toEqual(7);
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
