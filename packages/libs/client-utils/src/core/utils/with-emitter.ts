import { MyEventTarget } from './MyEventTarget';
import type { IEmit } from './helpers';
import { asyncLock } from './helpers';
import type { Any, UnionToIntersection } from './types';

type ToNextType<T extends Array<{ event: string; data: Any }>> =
  UnionToIntersection<
    {
      [K in keyof T]: T[K] extends { event: infer Tag }
        ? (event: Tag) => Promise<T[K]['data']>
        : never;
    }[number]
  >;

type ToOnType<
  T extends Array<{ event: string; data: Any }>,
  WrapperType,
> = UnionToIntersection<
  {
    [K in keyof T]: T[K] extends { event: infer Tag; data: infer R }
      ? (event: Tag, cb: (data: R) => Any) => WrapperType
      : never;
  }[number]
>;

export interface IEmitterWrapper<
  T extends Array<{ event: string; data: Any }>,
  Extra extends Array<{ event: string; data: Any }>,
  ExecReturnType,
> {
  on: ToOnType<[...T, ...Extra], this>;
  execute: () => ExecReturnType;
  executeTo: (() => ExecReturnType) & ToNextType<[...T, ...Extra]>;
}

export type WithEmitter<
  Extra extends [...Array<{ event: string; data: Any }>] = [],
> = <T extends (emit: IEmit) => Any>(
  fn: T,
) => (
  ...args: Parameters<ReturnType<T>>
) => IEmitterWrapper<
  ReturnType<T>['_event_type'],
  Extra,
  ReturnType<ReturnType<T>>
>;

export const withEmitter: WithEmitter =
  (fn) =>
  (...args: Any[]): Any => {
    const emitter = new MyEventTarget();
    const allEvents: Record<string, unknown> = {};
    const execute: (...args: any) => Promise<any> = fn(((event: string) => {
      allEvents[event] = null;
      return async (data: Any) => {
        allEvents[event] = data;
        await emitter.dispatchEvent(event, data);
        return data;
      };
    }) as Any);
    let executePromise: Promise<any> | null = null;

    const exec = (): Promise<any> => {
      if (executePromise !== null) {
        return executePromise;
      }
      executePromise = execute(...args);
      return executePromise;
    };
    const lock = asyncLock();
    const wrapper = {
      on: (event: string, cb: (data: Any) => Any) => {
        // CustomEvent is not typed correctly
        emitter.addEventListener(event, cb);
        return wrapper;
      },
      executeTo: (event?: string) => {
        if (event === undefined) {
          lock.open();
          return exec();
        }
        if (allEvents[event] !== null) {
          return Promise.resolve(allEvents[event]);
        }
        const pr = new Promise((resolve, reject) => {
          exec().catch(reject);

          const resolveAndLock = (data: any) => {
            resolve(data);
            emitter.removeEventListener(event, resolveAndLock);
            lock.close();
            return lock.waitTillOpen();
          };
          emitter.addEventListener(event, resolveAndLock);
        });

        lock.open();
        return pr;
      },
      execute: () => {
        return wrapper.executeTo();
      },
    };
    return wrapper;
  };
