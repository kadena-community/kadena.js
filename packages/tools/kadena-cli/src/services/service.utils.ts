// import type { IServices } from './index.js';

// type ServiceGeneric = IServices[keyof IServices];

// const callHistory: [string, unknown[]][] = [];
// /**
//  * Can be used in services/index.ts to wrap around a service.
//  * Will record calls that can be then asserted against.
//  */
// export function recordCalls<T extends ServiceGeneric>(
//   service: T,
//   serviceName: string,
// ): T {
//   return new Proxy(service, {
//     get(target, prop) {
//       const method = target[prop as keyof T];
//       if (typeof method !== 'function') return method;
//       return (...args: any[]) => {
//         const historyKey = `${serviceName}.${prop as string}`;
//         callHistory.push([historyKey, args]);
//         return method(...args);
//       };
//     },
//   });
// }

// export function getCallHistory(): typeof callHistory {
//   return callHistory;
// }

// export const serviceCalledWith = (
//   method: string,
//   args: (boolean | string | ((arg: unknown) => boolean))[],
// ): boolean => {
//   return callHistory.some((call) => {
//     if (call[0] !== method) return false;
//     return args.every((arg, index) => {
//       if (typeof arg === 'string') {
//         return call[1][index] === arg;
//       }
//       if (typeof arg === 'boolean') {
//         return arg;
//       }
//       return arg(call[1][index]);
//     });
//   });
// };
