import { memoryFileSystemService } from './fs.memory.service.js';
import type { IFileSystemService } from './fs.service.js';
import { fileSystemService } from './fs.service.js';

export interface IServices {
  filesystem: IFileSystemService;
}

const IS_TEST: boolean = process.env.VITEST === 'true';

export const services: IServices = {
  filesystem: IS_TEST ? memoryFileSystemService : fileSystemService,
};
