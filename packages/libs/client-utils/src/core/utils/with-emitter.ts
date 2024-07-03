import { MyEventTarget } from './MyEventTarget';
import type { IEmit } from './helpers';
import { asyncLock } from './helpers';
import type { Any, UnionToIntersection } from './types';

type ExecuteTo<T extends Array<{ event: string; data: Any }>> =
  UnionToIntersection<
    {
      [K in keyof T]: (event: T[K]['event']) => Promise<T[K]['data']>;
    }[number]
  >;

type StartFrom<
  T extends Array<{ event: string; data: Any }>,
  TReturn,
> = UnionToIntersection<
  {
    [K in keyof T]: (event: T[K]['event'], data: T[K]['data']) => TReturn;
  }[number]
>;

type OnType<
  T extends Array<{ event: string; data: Any }>,
  WrapperType,
> = UnionToIntersection<
  {
    [K in keyof T]: (
      event: T[K]['event'],
      cb: (data: T[K]['data']) => Any,
    ) => WrapperType;
  }[number]
>;

/**
 * @alpha
 */
export interface IEmitterWrapper<
  T extends Array<{ event: string; data: Any }>,
  Extra extends Array<{ event: string; data: Any }>,
  ExecReturnType,
> {
  on: OnType<[...T, ...Extra], this>;
  execute: () => ExecReturnType;
  executeTo: (() => ExecReturnType) & ExecuteTo<[...T]>;
}

type ExtractEventType<T> = T extends { _event_type: infer U } ? U : any;

/**
 * @alpha
 */
export type WithEmitter<
  Extra extends [...Array<{ event: string; data: Any }>] = [],
> = <T extends (emit: IEmit) => Any>(
  fn: T,
) => {
  (
    ...args: Parameters<ReturnType<T>>
  ): IEmitterWrapper<
    ExtractEventType<ReturnType<T>>,
    Extra,
    ReturnType<ReturnType<T>>
  >;
  from: StartFrom<
    [...ExtractEventType<ReturnType<T>>, ...Extra],
    IEmitterWrapper<
      ExtractEventType<ReturnType<T>>,
      Extra,
      ReturnType<ReturnType<T>>
    >
  >;
};

/**
 * @alpha
 */
export const withEmitter: WithEmitter = (fn) => {
  const createListener = (
    args: Any[],
    from: { event: string | null; data: any } = { event: null, data: null },
  ): Any => {
    const emitter = new MyEventTarget();
    const allEvents: Record<string, unknown> = {};
    const execute: () => (...args: any) => Promise<any> = () =>
      fn(((event: string) => {
        allEvents[event] = null;
        const emit = async (data: Any) => {
          allEvents[event] = data;
          await emitter.dispatchEvent(event, data);
          return data;
        };
        if (from.event === event) {
          emit.startPoint = from.data;
        }
        return emit;
      }) as Any);
    let executePromise: Promise<any> | null = null;

    const exec = (): Promise<any> => {
      if (executePromise !== null) {
        return executePromise;
      }

      executePromise = execute()(...args);
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
        if (executePromise && event in allEvents && allEvents[event] !== null) {
          return Promise.resolve(allEvents[event]);
        }
        const pr = new Promise((resolve, reject) => {
          exec().catch(reject);

          const resolveAndLock = async (data: any) => {
            resolve(data);
            emitter.removeEventListener(event, resolveAndLock);
            console.log('lock the door');
            if (!lock.isLocked()) {
              lock.close();
            }
            await lock.waitTillOpen();
            console.log('open the door');
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
  const withFrom = (...args: any[]) => createListener(args);
  withFrom.from = (event: string, data: Any) => {
    return createListener([], { event, data });
  };
  return withFrom as any;
};
