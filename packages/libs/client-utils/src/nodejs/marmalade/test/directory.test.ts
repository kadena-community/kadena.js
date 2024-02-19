import { existsSync, mkdirSync } from 'fs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { clearDir } from '../../services/path';
import { deleteLocalFiles, handleDirectorySetup } from '../utils/directory';

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
describe('deleteLocalFiles', () => {
  it('should call clearDir with the correct paths', () => {
    const localConfig = {
      templatePath: 'templatePath',
      codeFilesPath: 'codeFilesPath',
      namespacePath: 'namespacePath',
    };

    deleteLocalFiles(localConfig);

    expect(clearDir).toHaveBeenCalledTimes(3);
    expect(clearDir).toHaveBeenCalledWith('templatePath');
    expect(clearDir).toHaveBeenCalledWith('codeFilesPath');
    expect(clearDir).toHaveBeenCalledWith('namespacePath');
  });

  it('should not call clearDir with duplicate paths', () => {
    const localConfig = {
      templatePath: 'templatePath',
      codeFilesPath: 'templatePath',
      namespacePath: 'templatePath',
    };

    deleteLocalFiles(localConfig);

    expect(clearDir).toHaveBeenCalledTimes(1);
    expect(clearDir).toHaveBeenCalledWith('templatePath');
  });
});
