import { vol } from 'memfs';
import type { Dirent, Stats } from 'node:fs';
import { dirname } from 'path';
import type { IFileSystemService } from './fs.service.js';

export const fs: typeof vol.promises = vol.promises;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const memoryFsToJson = (): any => vol.toJSON();

export const memoryFileSystemService: IFileSystemService = {
  async readFile(path: string) {
    try {
      return (await fs.readFile(path, 'utf8')) as string;
    } catch (e) {
      return null;
    }
  },
  async writeFile(path: string, data: string) {
    await fs.writeFile(path, data, { encoding: 'utf8' });
  },
  async deleteFile(path: string) {
    await fs.unlink(path);
  },
  async deleteDirectory(path: string) {
    await fs.rm(path, { recursive: true });
  },
  async directoryExists(path: string) {
    try {
      const stat = await fs.stat(path);
      return stat.isDirectory();
    } catch {
      return false;
    }
  },
  async fileExists(path: string) {
    try {
      const stat = await fs.stat(path);
      return stat.isFile();
    } catch {
      return false;
    }
  },
  async ensureDirectoryExists(path: string) {
    if (await memoryFileSystemService.directoryExists(path)) return;

    const isFile = path.split('/').pop()?.includes('.') ?? false;

    await fs.mkdir(isFile ? dirname(path) : path, {
      recursive: true,
    });
  },
  async readDir(path: string) {
    const result = await fs.readdir(path);
    return result.map((file) => file.toString());
  },
  async readDirWithTypes(path: string) {
    const result = await fs.readdir(path, { withFileTypes: true });
    return result as unknown as Dirent[];
  },
  async appendFile(path: string, data: string) {
    await fs.appendFile(path, data, { encoding: 'utf8' });
  },
  async lstat(path: string) {
    return fs.lstat(path) as unknown as Stats;
  },
};
