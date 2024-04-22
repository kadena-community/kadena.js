import { dotenv } from './dotenv';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withRetry<T extends any[], R>(
  func: (...args: T) => Promise<R>,
  retries: number = dotenv.CHAINWEB_NODE_RETRY_ATTEMPTS,
  delay: number = dotenv.CHAINWEB_NODE_RETRY_DELAY,
): (...funcArgs: T) => Promise<R> {
  return async (...funcArgs: T) => {
    for (let i = 1; i <= retries; i++) {
      try {
        return await func(...funcArgs);
      } catch (error) {
        if (i < retries) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          throw error;
        }
      }
    }
    // This will never be reached, but TypeScript doesn't know that
    return await func(...funcArgs);
  };
}
