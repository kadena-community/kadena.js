import type { Command } from 'commander';
import type z from 'zod';

export function processZodErrors<T>(
  program: Command,
  e: unknown,
  args: T,
): void {
  program.error(
    `${(e as z.ZodError).errors
      .map((err) => {
        if (err.code === 'invalid_type') {
          return `${err.message} (${err.expected} was ${err.received})`;
        }
        return err.message;
      })
      .reduce((a, b) => `${a}\n${b}`)}\nReceived arguments ${JSON.stringify(
      args,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    )}\n${program.helpInformation(e as any)}`,
  );
}
