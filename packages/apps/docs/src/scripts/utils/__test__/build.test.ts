import { afterEach, describe, expect, it, vi } from 'vitest';
import { createString, initFunc } from '../build';

describe('utils build', () => {
  describe('createString', () => {
    it('should return the correct start line', async () => {
      const result = createString('create foldertree from config.yaml', true);
      const expectedResult =
        '============ START \u001b[34mCREATE FOLDERTREE FROM CONFIG.YAML\u001b[39m ====\n\n';
      expect(result).toEqual(expectedResult);
    });
    it('should return the correct end line', async () => {
      const result = createString('create foldertree from config.yaml');
      const expectedResult =
        '\n\n============== END \u001b[34mCREATE FOLDERTREE FROM CONFIG.YAML\u001b[39m ====';
      expect(result).toEqual(expectedResult);
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
      expect(consoleMock).toHaveBeenCalledTimes(3);
      expect(consoleWarnMock).toHaveBeenCalledTimes(0);
      expect(func).toHaveBeenCalledOnce();
    });

    it('should console log all errors, if there are any', async () => {
      const func = vi.fn().mockImplementation(() => ({
        errors: ['error 1', 'error 2', 'error 3'],
        success: [],
      }));

      await initFunc(func, 'test function');
      expect(consoleMock).toHaveBeenCalledTimes(1);
      expect(consoleWarnMock).toHaveBeenCalledTimes(3);
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
      expect(consoleMock).toHaveBeenCalledTimes(1);
      expect(consoleWarnMock).toHaveBeenCalledTimes(1);
      expect(func).toHaveBeenCalledOnce();
    });
  });
});
