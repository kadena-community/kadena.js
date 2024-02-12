import { existsSync, mkdirSync } from 'fs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { clearDir } from '../../services/path';
import { handleDirectorySetup } from '../utils/directory';

// Mock the fs and path modules
vi.mock('fs', () => ({
  existsSync: vi.fn(),
  mkdirSync: vi.fn(),
}));
vi.mock('../../services/path', () => ({
  clearDir: vi.fn(),
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe('handleDirectorySetup', () => {
  it('should create directories if they do not exist', () => {
    //@ts-ignore
    existsSync.mockReturnValue(false);

    handleDirectorySetup('templatePath', 'codeFilePath', 'nsFilesPath');

    expect(existsSync).toHaveBeenCalledTimes(3);
    expect(mkdirSync).toHaveBeenCalledTimes(3);
    expect(clearDir).not.toHaveBeenCalled();
  });

  it('should clear directories if they exist', () => {
    //@ts-ignore
    existsSync.mockReturnValue(true);

    handleDirectorySetup('templatePath', 'codeFilePath', 'nsFilesPath');

    expect(existsSync).toHaveBeenCalledTimes(3);
    expect(clearDir).toHaveBeenCalledTimes(3);
    expect(mkdirSync).not.toHaveBeenCalled();
  });

  it('should not clear codeFilePath if it is the same as templatePath', () => {
    //@ts-ignore
    existsSync.mockReturnValue(true);

    handleDirectorySetup('samePath', 'samePath', 'nsFilesPath');

    expect(existsSync).toHaveBeenCalledTimes(2);
    expect(clearDir).toHaveBeenCalledTimes(2);
    expect(mkdirSync).not.toHaveBeenCalled();
  });
});
