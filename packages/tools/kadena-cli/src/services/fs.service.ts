import fs from 'node:fs/promises';
import path from 'path';

export interface IFileSystemService {
  readFile: (path: string) => Promise<string | null>;
  writeFile: (path: string, data: string) => Promise<void>;
  directoryExists: (directoryPath: string) => Promise<boolean>;
  fileExists: (directoryPath: string) => Promise<boolean>;
  ensureDirectoryExists: (directoryPath: string) => Promise<void>;
  readDir: (directoryPath: string) => Promise<string[]>;
}

export const fileSystemService: IFileSystemService = {
  async readFile(path: string) {
    try {
      return await fs.readFile(path, 'utf8');
    } catch (e) {
      return null;
    }
  },
  async writeFile(file: string, data: string) {
    await fs.writeFile(file, data, 'utf8');
  },
  async directoryExists(dir: string) {
    try {
      const stat = await fs.stat(dir);
      return stat.isDirectory();
    } catch {
      return false;
    }
  },
  async fileExists(file: string) {
    try {
      const stat = await fs.stat(file);
      return stat.isFile();
    } catch {
      return false;
    }
  },
  async ensureDirectoryExists(file: string) {
    const dirname = path.dirname(file);
    if (!(await fileSystemService.directoryExists(dirname))) {
      await fs.mkdir(dirname, { recursive: true });
    }
  },
  async readDir(directoryPath: string) {
    return fs.readdir(directoryPath);
  },
};
