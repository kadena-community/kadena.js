import { Command } from 'commander';
import util from 'node:util';
import { loadProgram } from '../program.js';

class OutputCapture {
  private _stdout: string[] = [];
  private _stderr: string[] = [];
  private _print: boolean = false;
  private _originalStdoutWrite: typeof process.stdout.write;
  private _originalStderrWrite: typeof process.stderr.write;
  private _originalConsoleLog: typeof console.log;
  public constructor() {
    this._originalStdoutWrite = process.stdout.write.bind(process.stdout);
    this._originalStderrWrite = process.stderr.write.bind(process.stderr);
    this._originalConsoleLog = console.log.bind(console);
  }
  public capture(print: boolean = false): void {
    this._print = print;
    process.stdout.write = (chunk, encoding?: any, callback?: any) => {
      this._stdout.push(chunk.toString());
      if (this._print) this._originalStdoutWrite(chunk, encoding, callback);
      return true;
    };
    process.stderr.write = (chunk, encoding?: any, callback?: any) => {
      this._stderr.push(chunk.toString());
      if (this._print) this._originalStderrWrite(chunk, encoding, callback);
      return true;
    };
    console.log = function () {
      // @ts-ignore
      process.stdout.write(`${util.format.apply(this, arguments)}\n`);
    };
  }
  public get stdout(): string[] {
    return this._stdout;
  }
  public get stderr(): string[] {
    return this._stderr;
  }
  public clear(): void {
    this._stdout = [];
    this._stderr = [];
  }
  public reset(): void {
    process.stdout.write = this._originalStdoutWrite;
    process.stderr.write = this._originalStderrWrite;
    console.log = this._originalConsoleLog;
  }
}

export const capture: OutputCapture = new OutputCapture();

function parseStdout(lines: string[]): string[] {
  return lines.flatMap((line) => line.split('\n')).filter((line) => line);
}

export async function run(
  args: string[],
): Promise<{ stdout: string[]; stderr: string[] }> {
  capture.capture();

  try {
    const program = loadProgram(new Command());
    await program.parseAsync(['node', 'index.js', ...args]);
  } catch (e) {
    capture.stderr.push(e.message);
  }
  capture.reset();
  const result = {
    stdout: parseStdout(capture.stdout),
    stderr: parseStdout(capture.stderr),
  };
  capture.clear();
  return result;
}

export function isValidEncryptedValue(value: string | unknown): boolean {
  if (typeof value !== 'string') return false;
  const buffer = Buffer.from(value, 'base64').toString('utf8');
  const parts = buffer.split('.');
  // parts: salt, iv, tag, data, public key (only for secretKeys, not rootKey)
  return parts.length === 4 || parts.length === 5;
}
