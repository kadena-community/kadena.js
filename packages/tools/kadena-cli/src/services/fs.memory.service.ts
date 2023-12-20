import { vol } from 'memfs';
import path from 'path';
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
  async writeFile(file: string, data: string) {
    await fs.writeFile(file, data, { encoding: 'utf8' });
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
  async ensureDirectoryExists(directoryPath: string) {
    if (await memoryFileSystemService.directoryExists(directoryPath)) return;

    const isFile = directoryPath.split('/').pop()?.includes('.') ?? false;

    await fs.mkdir(isFile ? path.dirname(directoryPath) : directoryPath, {
      recursive: true,
    });
  },
  async readDir(directoryPath: string) {
    const result = await fs.readdir(directoryPath);
    return result.map((x) => x.toString());
  },
};
