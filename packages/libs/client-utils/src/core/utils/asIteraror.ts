import type { IEmit } from './helpers';

function createAsyncListener() {
  let listener = (data?: any): void => {
    throw new Error('no one is listening');
  };
  let pusher: (data?: any) => void;
  return {
    push: (data: any, terminate = false) => {
      listener(data);
      if (terminate) return;
      return new Promise<any>((resolve) => {
        pusher = resolve;
      });
    },
    listen: () => {
      if (pusher) pusher();
      return new Promise<any>((resolve) => {
        listener = resolve;
      });
    },
  };
}

export const asIterator =
  (task: (emit: IEmit) => (...args: any[]) => Promise<any>) =>
  (...args: any[]) => {
    const asyncBuffer = createAsyncListener();

    const pipeline = task(
      ((name: string) => (data: any) =>
        asyncBuffer
          .push({ done: false, value: { name, data } })
          ?.then(() => data)) as IEmit,
    );
    let started = false;
    let ended = false;
    const start = () => {
      if (started) return;
      pipeline(...args)
        .then((result) => {
          asyncBuffer.push({ done: false, value: result }, true) as undefined;
          ended = true;
        })
        .catch((error) => {
          asyncBuffer.push(
            { done: false, value: { error } },
            true,
          ) as undefined;
          ended = true;
        });
      started = true;
    };

    const next = async (): Promise<{ done: boolean; value: any }> => {
      if (ended) return { done: true, value: undefined };
      const listen = asyncBuffer.listen();
      start();
      return listen;
    };

    return {
      next,
      [Symbol.asyncIterator]: () => ({
        next,
      }),
    };
  };
