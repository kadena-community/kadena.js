import { memoryFileSystemService } from './fs.memory.service.js';
import type { IFileSystemService } from './fs.service.js';
import { fileSystemService } from './fs.service.js';
import { mock } from './service.utils.js';
export { getCallHistory, mockServiceCalledWith } from './service.utils.js';

export interface IServices {
  filesystem: IFileSystemService;
}

const IS_TEST: boolean = process.env.VITEST === 'true';

export const services: IServices = {
  filesystem: IS_TEST ? mock(memoryFileSystemService, 'fs') : fileSystemService,
};
