import { Command } from 'commander';
import { format } from 'util';
import { vi } from 'vitest';
import { loadProgram } from '../program.js';
import { safeJsonParse } from './globalHelpers.js';
import type { LevelValue } from './logger.js';
import { LEVELS, log } from './logger.js';
import * as prompts from './prompts.js';
import * as readStdin from './stdin.js';

export function isValidEncryptedValue(value: string | unknown): boolean {
  if (typeof value !== 'string') return false;
  const buffer = Buffer.from(value, 'base64').toString('utf8');
  const parts = buffer.split('.');
  // parts: salt, iv, tag, data, public key (only for secretKeys, not rootKey)
  return parts.length === 3 || parts.length === 4;
}

const captureLogs = (
  level?: LevelValue,
): (() => { stdout: string[]; stderr: string[] }) => {
  const stdout: string[] = [];
  const stderr: string[] = [];
  if (level !== undefined) log.setLevel(level);
  log.setTransport((record) => {
    if (record.level === LEVELS.output) stdout.push(format(...record.args));
    else stderr.push(format(...record.args));
  });
  return () => ({
    stdout,
    stderr,
  });
};

export const runCommand = async (
  args: string | string[],
  options?: { stdin?: string; logLevel?: LevelValue },
): Promise<{ stdout: string; stderr: string }> => {
  const argsArray = Array.isArray(args) ? args : args.split(' ');
  const getLogs = captureLogs(options?.logLevel);

  const stdinMock = vi.spyOn(readStdin, 'readStdin');
  if (options?.stdin !== undefined) {
    stdinMock.mockImplementation(async () => options.stdin ?? null);
  }

  await loadProgram(new Command()).parseAsync([
    'node',
    'index.js',
    ...argsArray,
  ]);

  if (options?.stdin !== undefined) {
    stdinMock.mockRestore();
  }

  const { stdout, stderr } = getLogs();
  return { stdout: stdout.join('\n'), stderr: stderr.join('\n') };
};

export const runCommandJson = async (
  args: string | string[],
  options?: { stdin?: string },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  const argsArray = Array.isArray(args) ? args : args.split(' ');
  if (!argsArray.includes('--json')) argsArray.push('--json');
  const { stdout, stderr } = await runCommand(argsArray, options);
  const parsed = safeJsonParse(stdout);
  if (parsed === null) {
    throw new Error(
      `Failed to parse JSON output: ${stdout} (stderr: ${stderr})`,
    );
  }
  return parsed;
};

export const mockPrompts = (data: {
  select?: Record<string, string | boolean | number>;
  password?: Record<string, string>;
  input?: Record<string, string>;
  checkbox?: Record<string, number[]>;
  verbose?: boolean;
}): void => {
  vi.spyOn(prompts, 'select').mockImplementation((async (args) => {
    const message = (await args.message) as string;
    if (data.verbose === true) {
      // eslint-disable-next-line no-console, @typescript-eslint/strict-boolean-expressions
      console.log(
        `select: ${message.trim()} | values: ${args.choices
          .map((x) => (x.type === 'separator' ? null : x.value))
          .join(', ')}`,
      );
    }
    if (data.select) {
      const match = Object.entries(data.select).filter((x) =>
        message.includes(x[0]),
      );
      if (match.length > 0) return match[0][1];
    }
    throw Error(`Missing select prompt mock for: "${message}"`);
  }) as typeof prompts.select);

  vi.spyOn(prompts, 'input').mockImplementation((async (args) => {
    const message = (await args.message) as string;
    // eslint-disable-next-line no-console, @typescript-eslint/strict-boolean-expressions
    if (data.verbose) console.log(`input: ${message}`);
    if (data.input) {
      const match = Object.entries(data.input).filter((x) =>
        message.includes(x[0]),
      );
      if (match.length > 0) return match[0][1];
    }
    throw Error(`Missing input prompt mock for: "${message}"`);
  }) as typeof prompts.input);

  vi.spyOn(prompts, 'password').mockImplementation((async (args) => {
    const message = (await args.message) as string;
    // eslint-disable-next-line no-console, @typescript-eslint/strict-boolean-expressions
    if (data.verbose) console.log(`password: ${message}`);
    if (data.password !== undefined) {
      const match = Object.entries(data.password).filter((x) =>
        message.includes(x[0]),
      );
      if (match.length > 0) return match[0][1];
    }
    throw Error(`Missing password prompt mock for: "${message}"`);
  }) as typeof prompts.password);

  vi.spyOn(prompts, 'checkbox').mockImplementation((async (args) => {
    const message = (await args.message) as string;
    const choices = args.choices.filter((x) => x.type !== 'separator');

    // eslint-disable-next-line no-console, @typescript-eslint/strict-boolean-expressions
    if (data.verbose) console.log(`checkbox: ${message}`);
    if (data.checkbox) {
      const match = Object.entries(data.checkbox).filter((x) =>
        message.includes(x[0]),
      );
      if (match.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return match[0][1].map((i) => (choices[i] as any).value);
      }
    }
    throw Error(`Missing checkbox prompt mock for: "${message}"`);
  }) as typeof prompts.checkbox);
};
