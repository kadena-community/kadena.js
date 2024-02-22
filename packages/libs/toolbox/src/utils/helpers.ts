import { exec } from 'node:child_process';
import { promisify } from 'node:util';

export async function pollFn(
  fn: () => Promise<boolean>,
  timeout: number,
  delayMs: number = 10,
) {
  const start = performance.now();
  while (performance.now() - start < timeout) {
    const isStarted = await fn();
    if (isStarted) {
      return true;
    }
    await delay(delayMs);
  }
  throw new Error('Timeout');
}

export const execAsync = promisify(exec);
export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
