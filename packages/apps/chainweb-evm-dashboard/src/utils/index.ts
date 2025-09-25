export { fetcher, chainOptions } from './chains';
export { __n, _n } from './number';

export const debounce = <F extends (...args: any[]) => void>(func: F, waitFor: number) => {
  let timeout: ReturnType<typeof setTimeout>;

  const debounced = (...args: Parameters<F>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced as (...args: Parameters<F>) => void;
};

export const throttle = <F extends (...args: any[]) => void>(func: F, limit: number) => {
  let inThrottle: boolean;

  return function(this: any, ...args: Parameters<F>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  } as (...args: Parameters<F>) => void;
}
