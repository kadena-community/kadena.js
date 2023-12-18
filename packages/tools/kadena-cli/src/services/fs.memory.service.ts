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
  async directoryExists(directoryPath: string) {
    const dirname = path.dirname(directoryPath);
    try {
      await fs.access(dirname);
      return true;
    } catch {
      return false;
    }
  },
  async ensureDirectoryExists(directoryPath: string) {
    const exists = await memoryFileSystemService.directoryExists(directoryPath);
    if (!exists) {
      await vol.promises.mkdir(directoryPath, { recursive: true });
    }
    return;
  },
  async readDir(directoryPath: string) {
    const result = await fs.readdir(directoryPath);
    return result.map((x) => x.toString());
  },
};
