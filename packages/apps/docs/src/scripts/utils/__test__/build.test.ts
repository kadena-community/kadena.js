import { createString, initFunc } from '../build';

describe('utils build', () => {
  describe('createString', () => {
    it('should return the correct start line', async () => {
      const result = createString('create foldertree from config.yaml', true);
      const expectedResult = /START/;
      expect(result).toMatch(expectedResult);
      const expectedResult2 = /CREATE FOLDERTREE FROM CONFIG.YAML/;
      expect(result).toMatch(expectedResult2);
    });
    it('should return the correct end line', async () => {
      const result = createString('create foldertree from config.yaml');
      const expectedResult = /END/;
      expect(result).toMatch(expectedResult);
      const expectedResult2 = /CREATE FOLDERTREE FROM CONFIG.YAML/;
      expect(result).toMatch(expectedResult2);
    });
  });

  describe('initFunc', () => {
    const consoleMock = vi
      .spyOn(console, 'log')
      .mockImplementation(() => undefined);
    const consoleWarnMock = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);
    afterEach(() => {
      consoleMock.mockReset();
      consoleWarnMock.mockReset();
    });

    it('should await the given function', async () => {
      const func = vi
        .fn()
        .mockImplementation(() => ({ errors: [], success: [] }));

      await initFunc(func, 'test function');
      expect(consoleMock).toHaveBeenCalledTimes(2);
      expect(consoleWarnMock).toHaveBeenCalledTimes(0);
      expect(func).toHaveBeenCalledOnce();
    });

    it('should console log all errors, if there are any', async () => {
      const func = vi.fn().mockImplementation(() => ({
        errors: ['error 1', 'error 2', 'error 3'],
        success: [],
      }));

      await initFunc(func, 'test function');
      expect(consoleMock).toHaveBeenCalledTimes(2);
      expect(consoleWarnMock).toHaveBeenCalledTimes(4);
      expect(func).toHaveBeenCalledOnce();
    });

    it('should console log all successes if there are no errors', async () => {
      const func = vi.fn().mockImplementation(() => ({
        errors: [],
        success: ['success'],
      }));

      await initFunc(func, 'test function');
      expect(consoleMock).toHaveBeenCalledTimes(3);
      expect(consoleWarnMock).toHaveBeenCalledTimes(0);
      expect(func).toHaveBeenCalledOnce();
    });

    it('should console log no successes if there are errors', async () => {
      const func = vi.fn().mockImplementation(() => ({
        errors: ['error'],
        success: ['success'],
      }));

      await initFunc(func, 'test function');
      expect(consoleMock).toHaveBeenCalledTimes(2);
      expect(consoleWarnMock).toHaveBeenCalledTimes(2);
      expect(func).toHaveBeenCalledOnce();
    });
  });
});
