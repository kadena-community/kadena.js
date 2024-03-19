import { IS_TEST } from '../constants/config.js';
import { memoryFileSystemService } from './fs.memory.service.js';
import type { IFileSystemService } from './fs.service.js';
import { fileSystemService } from './fs.service.js';

export interface IServices {
  filesystem: IFileSystemService;
}

export const services: IServices = {
  filesystem: IS_TEST ? memoryFileSystemService : fileSystemService,
};
