import type { Dirent, Stats } from 'fs';
import fs from 'node:fs/promises';

export interface IFileSystemService {
  readFile: (path: string) => Promise<string | null>;
  writeFile: (path: string, data: string) => Promise<void>;
  deleteFile: (path: string) => Promise<void>;
  deleteDirectory: (path: string) => Promise<void>;
  directoryExists: (path: string) => Promise<boolean>;
  fileExists: (path: string) => Promise<boolean>;
  ensureDirectoryExists: (path: string) => Promise<void>;
  readDir: (path: string) => Promise<string[]>;
  readDirWithTypes: (path: string) => Promise<Dirent[]>;
  appendFile: (path: string, data: string) => Promise<void>;
  lstat: (path: string) => Promise<Stats>;
}

export const fileSystemService: IFileSystemService = {
  async readFile(path: string) {
    try {
      return await fs.readFile(path, 'utf8');
    } catch (e) {
      return null;
    }
  },
  async writeFile(path: string, data: string) {
    await fs.writeFile(path, data, 'utf8');
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
  async ensureDirectoryExists(directory: string) {
    if (await fileSystemService.directoryExists(directory)) return;

    await fs.mkdir(directory, {
      recursive: true,
    });
  },
  async readDir(path: string) {
    return fs.readdir(path);
  },
  async readDirWithTypes(path: string) {
    return fs.readdir(path, { withFileTypes: true });
  },
  async appendFile(path: string, data: string) {
    await fs.appendFile(path, data, { encoding: 'utf8' });
  },
  async lstat(path: string) {
    return fs.lstat(path);
  },
};
