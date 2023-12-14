import fs from 'node:fs/promises';
import path from 'path';

export interface IFileSystemService {
  readFile: (path: string) => Promise<string | null>;
  writeFile: (path: string, data: string) => Promise<void>;
  directoryExists: (directoryPath: string) => Promise<boolean>;
  ensureDirectoryExists: (directoryPath: string) => Promise<void>;
  readDir: (directoryPath: string) => Promise<string[]>;
}

export const fileSystemService: IFileSystemService = {
  readFile: async (path: string) => {
    try {
      return fs.readFile(path, 'utf8');
    } catch (e) {
      return null;
    }
  },
  writeFile: async (file: string, data: string) => {
    await fs.writeFile(file, data, 'utf8');
  },
  async directoryExists(file: string) {
    const dirname = path.dirname(file);
    try {
      await fs.access(dirname, fs.constants.F_OK);
      return true;
    } catch {
      return false;
    }
  },
  async ensureDirectoryExists(file: string) {
    const dirname = path.dirname(file);
    if (!(await this.directoryExists(dirname))) {
      await fs.mkdir(dirname, { recursive: true });
    }
  },
  async readDir(directoryPath: string) {
    return fs.readdir(directoryPath);
  },
};

export const mockFileSystemService: IFileSystemService = {
  readFile: async (path: string) => {
    return '';
  },
  writeFile: async (path: string, data: string) => {
    return;
  },
  directoryExists: async (directoryPath: string) => {
    return true;
  },
  ensureDirectoryExists: async (directoryPath: string) => {
    return;
  },
  readDir: async (directoryPath: string) => {
    return [];
  },
};
