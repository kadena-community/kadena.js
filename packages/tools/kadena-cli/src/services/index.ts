import type { IFileSystemService } from './fs.serice.js';
import { fileSystemService, mockFileSystemService } from './fs.serice.js';

export interface IServices {
  filesystem: IFileSystemService;
}

const IS_TEST: boolean = process.env.VITEST === 'true';

export const services: IServices = {
  filesystem: IS_TEST ? mock(mockFileSystemService, 'fs') : fileSystemService,
};

type ServiceGeneric = IServices[keyof IServices];

const callHistory: [string, unknown[]][] = [];
function mock<T extends ServiceGeneric>(service: T, serviceName: string): T {
  return new Proxy(service, {
    get(target, prop) {
      const method = target[prop as keyof T];
      if (typeof method !== 'function') return method;
      return (...args: any[]) => {
        const historyKey = `${serviceName}.${prop as string}`;
        callHistory.push([historyKey, args]);
        method(...args);
      };
    },
  });
}

export function getCallHistory(): typeof callHistory {
  return callHistory;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const mockServiceCalledWith = (
  method: string,
  args: (boolean | string | ((arg: unknown) => boolean))[],
) => {
  return callHistory.some((call) => {
    if (call[0] !== method) return false;
    return args.every((arg, index) => {
      if (typeof arg === 'string') {
        return call[1][index] === arg;
      }
      if (typeof arg === 'boolean') {
        return arg;
      }
      return arg(call[1][index]);
    });
  });
};
