import { readFileSync } from 'node:fs';

let stdin: string | null = null;

/** should only be done once per execution, and BEFORE any prompts from inquirer */
export async function readStdin(): Promise<string | null> {
  if (stdin !== null) {
    return stdin;
  }

  if (!process.stderr.isTTY) {
    console.log('stdin is not a TTY - refusing to use STDIN');
    return null;
  }

  await import('ttys');
  try {
    // eslint-disable-next-line require-atomic-updates
    stdin = readFileSync(0, 'utf8');
  } catch (e) {
    /* empty */
  }

  return stdin;
}
