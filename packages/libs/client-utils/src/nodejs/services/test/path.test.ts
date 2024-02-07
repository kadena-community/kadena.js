import * as fs from 'fs';
import {
  mkdirSync,
  readdirSync,
  renameSync,
  rmdirSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'fs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { clearDir, createDirAndWriteFile, flattenFolder } from '../path';

vi.mock('fs', () => ({
  readdirSync: vi.fn(),
  statSync: vi.fn(),
  rmdirSync: vi.fn(),
  renameSync: vi.fn(),
  unlinkSync: vi.fn(),
  mkdirSync: vi.fn(),
  writeFileSync: vi.fn(),
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe('flattenFolder', async () => {
  it('should flatten the folder structure and rename files', async () => {
    const basePath = '/test/path';
    const fileExtensions = ['.txt'];
    const currentPath = '/test/path/subfolder';
    //@ts-ignore
    readdirSync.mockImplementation(() => ['file1.txt', 'file2.txt']);
    //@ts-ignore
    statSync.mockImplementation(() => ({ isDirectory: () => false }));
    //@ts-ignore
    rmdirSync.mockImplementation(() => {});
    //@ts-ignore
    renameSync.mockImplementation(() => {});

    const readdirSyncSpy = vi.spyOn(fs, 'readdirSync');
    const statSyncSpy = vi.spyOn(fs, 'statSync');
    const renameSyncSpy = vi.spyOn(fs, 'renameSync');

    // Call the function with test values
    await flattenFolder(basePath, fileExtensions, currentPath);

    expect(readdirSyncSpy).toHaveBeenNthCalledWith(1, currentPath);
    expect(statSyncSpy).toHaveBeenNthCalledWith(1, `${currentPath}/file1.txt`);
    expect(statSyncSpy).toHaveBeenNthCalledWith(2, `${currentPath}/file2.txt`);

    expect(renameSyncSpy).toHaveBeenNthCalledWith(
      1,
      `${currentPath}/file1.txt`,
      `${currentPath}.file1.txt`,
    );
    expect(renameSyncSpy).toHaveBeenNthCalledWith(
      2,
      `${currentPath}/file2.txt`,
      `${currentPath}.file2.txt`,
    );
  });
});

describe('clearDir', async () => {
  it('should clear the directory', async () => {
    const dir = '/test/path';
    const extension = '.txt';

    //@ts-ignore
    readdirSync.mockImplementation(() => ['file1.txt', 'file2.txt']);
    //@ts-ignore
    statSync.mockImplementation(() => ({ isDirectory: () => false }));
    //@ts-ignore
    unlinkSync.mockImplementation(() => {});

    const readdirSyncSpy = vi.spyOn(fs, 'readdirSync');
    const statSyncSpy = vi.spyOn(fs, 'statSync');
    const unlinkSyncSpy = vi.spyOn(fs, 'unlinkSync');

    // Call the function with test values
    clearDir(dir, extension);

    expect(readdirSyncSpy).toHaveBeenNthCalledWith(1, dir);
    expect(statSyncSpy).toHaveBeenNthCalledWith(1, `${dir}/file1.txt`);
    expect(statSyncSpy).toHaveBeenNthCalledWith(2, `${dir}/file2.txt`);

    expect(unlinkSyncSpy).toHaveBeenNthCalledWith(1, `${dir}/file1.txt`);
    expect(unlinkSyncSpy).toHaveBeenNthCalledWith(2, `${dir}/file2.txt`);
  });

  it('should throw an error if can not read directory', async () => {
    const dir = '/test/path';
    const extension = '.txt';

    //@ts-ignore
    //@ts-ignore
    readdirSync.mockImplementation(() => ['file1.txt', 'file2.txt']);
    //@ts-ignore
    statSync.mockImplementation(() => ({ isDirectory: () => false }));
    //@ts-ignore
    unlinkSync.mockImplementation(() => {
      throw new Error('error');
    });

    clearDir(dir, extension);
  });
});

describe('createDirAndWriteFile', async () => {
  it('should create a directory and write a file', async () => {
    const dir = '/test/path';
    const fileName = 'file.txt';
    const data = 'test data';

    //@ts-ignore
    mkdirSync.mockImplementation(() => {});
    //@ts-ignore
    writeFileSync.mockImplementation(() => {});

    const mkdirSyncSpy = vi.spyOn(fs, 'mkdirSync');
    const writeFileSyncSpy = vi.spyOn(fs, 'writeFileSync');

    // Call the function with test values
    await createDirAndWriteFile(dir, fileName, data);

    expect(mkdirSyncSpy).toHaveBeenNthCalledWith(1, dir, { recursive: true });
    expect(writeFileSyncSpy).toHaveBeenNthCalledWith(
      1,
      `${dir}/${fileName}`,
      data,
    );
  });
});
