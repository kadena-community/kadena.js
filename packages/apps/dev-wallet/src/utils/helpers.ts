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
