import { ChainId } from '@kadena/client';

export const execInSequence = <Args extends unknown[], T>(
  fn: (...args: Args) => Promise<T>,
) => {
  let taskChain: Promise<T | void> = Promise.resolve();
  return (...args: Args) => {
    taskChain = taskChain.catch(() => undefined).then(() => fn(...args));
    return taskChain as Promise<T>;
  };
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
export const getAccountName = (account: string) => account;
// `${account.substring(0, 9)}...${account.substring(account.length - 5)}`;

export const shorten = (str: string, chars: number = 4) => {
  if (!str) return '';
  return str.length > 2 * chars + 4
    ? `${str.slice(0, chars)}...${str.slice(str.length - chars)}`
    : str;
};

export function formatList(array: number[]): string {
  if (array.length === 1) return array[0].toString();
  // Sort the array first
  array.sort((a, b) => a - b);

  const result = [];
  let start = array[0];
  let end = array[0];

  for (let i = 1; i <= array.length; i++) {
    if (array[i] === end + 1) {
      // Extend the range
      end = array[i];
    } else {
      // Finalize the current range and start a new one
      if (start === end) {
        result.push(start.toString());
      } else if (end === start + 1) {
        // Special case for two consecutive numbers
        result.push(start.toString(), end.toString());
      } else {
        result.push(`${start}..${end}`);
      }
      start = array[i];
      end = array[i];
    }
  }

  return `${result.join(',')}`;
}

export const formatChainIds = (chainIds: ChainId[]) => {
  const chains = chainIds.map((id) => +id);
  return formatList(chains);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const throttle = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
) => {
  let lastCall = 0;
  let lastResult: ReturnType<T>;
  return (...args: Parameters<T>): ReturnType<T> => {
    const now = Date.now();
    if (now - lastCall < delay) return lastResult;
    lastCall = now;
    lastResult = fn(...args);
    return lastResult;
  };
};

export function createEventEmitter<
  E extends Record<string | number | symbol, P>,
  T extends string | number | symbol = keyof E,
  P = any,
>() {
  const listeners: Record<any, any[]> = {} as any;
  return {
    emit: <S extends T>(event: S, payload: E[S]) => {
      for (const cb of listeners[event] || []) {
        (cb as (payload: E[T]) => void)(payload);
      }
      for (const cb of listeners['*'] || []) {
        (cb as (event: T, payload: P) => void)(event, payload);
      }
    },
    subscribe: <S extends T | '*'>(
      event: S,
      cb: S extends '*'
        ? (event: T, payload: E[T]) => void
        : (payload: E[S]) => void,
    ) => {
      listeners[event] = listeners[event] || [];
      const listenersForEvent = listeners[event];
      listenersForEvent.push(cb);
      return () => {
        const index = listenersForEvent.indexOf(cb);
        if (index > -1) {
          listenersForEvent.splice(index, 1);
        }
      };
    },
  };
}

const padStart = (n: number) => (str: string | number) =>
  str.toString().padStart(n, '0');

const twoDigitPad = padStart(2);

export function toISOLocalDateTime(time: number) {
  const date = new Date(time);
  const year = date.getFullYear();
  const mm = twoDigitPad(date.getMonth() + 1);
  const dd = twoDigitPad(date.getDate());
  const hh = twoDigitPad(date.getHours());
  const min = twoDigitPad(date.getMinutes());
  return `${year}-${mm}-${dd}T${hh}:${min}`;
}
