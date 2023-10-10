import type { Any, AnyFunc, First, IfAny, Tail } from '../types';

import type { IEmit } from './helpers';

type GeneralEvent<T> = (event: string, cb: (data: unknown) => Any) => T;

type EventListenerType<
  Events extends Array<{ event: string; data: Any }>,
  WrapperType = Any,
  Acc extends AnyFunc = Any,
> = Events extends []
  ? Acc & GeneralEvent<WrapperType>
  : First<Events> extends { event: infer Tag; data: infer R }
  ? EventListenerType<
      Tail<Events> extends Any[] ? Tail<Events> : [],
      WrapperType,
      IfAny<
        Acc,
        (event: Tag, cb: (data: R) => Any) => WrapperType,
        Acc & ((event: Tag, cb: (data: R) => Any) => WrapperType)
      >
    >
  : EventListenerType<
      Tail<Events> extends Any[] ? Tail<Events> : [],
      WrapperType,
      Acc
    >;

export interface IRT<
  T extends Array<{ event: string; data: Any }>,
  Extra extends Array<{ event: string; data: Any }>,
  ExecReturnType,
> {
  on: EventListenerType<[...Extra, ...T], this>;
  execute: () => ExecReturnType;
}

export type WithEmitter<
  Extra extends [...Array<{ event: string; data: Any }>] = [],
> = <T extends (emit: IEmit) => Any>(
  fn: T,
) => (
  ...args: Parameters<ReturnType<T>>
) => IRT<ReturnType<T>['_event_type'], Extra, ReturnType<T>>;

export const withEmitter: WithEmitter =
  (fn) =>
  (...args: Any[]): Any => {
    const emitter = new EventTarget();
    const execute = fn(((tag: string) => (data: Any) => {
      emitter.dispatchEvent(new CustomEvent(tag, { detail: data }));
      return data;
    }) as Any);
    const wrapper = {
      on: (event: string, cb: (data: Any) => Any) => {
        // CustomEvent is not typed correctly
        emitter.addEventListener(event, ({ detail }: Any) => cb(detail));
        return wrapper;
      },
      execute: () => execute(...args),
    };
    return wrapper;
  };
