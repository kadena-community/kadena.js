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
  next: ToNextType<[...T, ...Extra]>;
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
    const execute = fn(((event: string) => async (data: Any) => {
      await emitter.dispatchEvent(event, data);
      return data;
    }) as Any);
    const lock = asyncLock();
    let executeCalled = false;
    const wrapper = {
      on: (event: string, cb: (data: Any) => Any) => {
        // CustomEvent is not typed correctly
        emitter.addEventListener(event, cb);
        return wrapper;
      },
      execute: async () => {
        if (executeCalled) {
          throw new Error('execute can only be called once');
        }
        executeCalled = true;
        return execute(...args);
      },
      next: (event: string) => {
        const pr = new Promise((resolve, reject) => {
          if (!executeCalled) {
            wrapper.execute().catch(reject);
          }
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
    };
    return wrapper;
  };
