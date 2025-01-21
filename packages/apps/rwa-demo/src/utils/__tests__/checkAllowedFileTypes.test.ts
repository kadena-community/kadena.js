import {
  checkAllowedFileTypes,
  checkNotAllowedFileTypes,
} from '../checkAllowedFileTypes';

describe('checkAllowedFileTypes utils', () => {
  const mocks = vi.hoisted(() => {
    return {
      ALLOWEDFILETYPES: vi.fn(),
    };
  });

  beforeEach(() => {
    vi.mock('@/constants', async (importOriginal) => {
      const actual = (await importOriginal()) as {};
      return {
        ...actual,
        ALLOWEDFILETYPES: mocks.ALLOWEDFILETYPES,
      };
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('checkAllowedFileTypes', () => {
    it('should return true when you give a correct File', () => {
      mocks.ALLOWEDFILETYPES.mockReturnValue(['text/csv']);
      const file = new File(['test'], 'test.csv', { type: 'text/csv' });
      const result = checkAllowedFileTypes(file);
      expect(result).toBe(true);
    });

    it('should return false when you give a incorrect File', () => {
      mocks.ALLOWEDFILETYPES.mockReturnValue(['text/not correct']);
      const file = new File(['test'], 'test.csv', { type: 'text/csv' });
      const result = checkAllowedFileTypes(file);
      expect(result).toBe(false);
    });
  });

  describe('checkNotAllowedFileTypes', () => {
    it('should return true when you give an  INcorrect File', () => {
      mocks.ALLOWEDFILETYPES.mockReturnValue(['text/notvalid']);
      const file = new File(['test'], 'test.csv', { type: 'text/csv' });
      const result = checkNotAllowedFileTypes(file);
      expect(result).toBe(true);
    });

    it('should return false when you give an  correct File', () => {
      mocks.ALLOWEDFILETYPES.mockReturnValue(['text/invalid', 'text/csv']);
      const file = new File(['test'], 'test.csv', { type: 'text/csv' });
      const result = checkNotAllowedFileTypes(file);
      expect(result).toBe(false);
    });
  });
});
