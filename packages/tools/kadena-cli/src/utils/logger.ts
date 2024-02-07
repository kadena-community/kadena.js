import type { ChalkInstance } from 'chalk';
import { Chalk } from 'chalk';
import { formatWithOptions } from 'node:util';

interface ILog {
  date: Date;
  level: number;
  args: unknown[];
}
type Transport = (log: ILog) => void;

// If in CI or other non-interactive environment, disable colors
const stderrColorsEnabled =
  process.env.COLORS === 'false' ||
  process.env.COLORS === '0' ||
  process.env.NODE_DISABLE_COLORS === 'true' ||
  process.env.NODE_DISABLE_COLORS === '1' ||
  process.env.NO_COLOR === 'true' ||
  process.env.NO_COLOR === '1' ||
  process.stderr.isTTY !== true
    ? false
    : true;

// Be more strict for stdout, only enable colors if stdout is a TTY
const stdoutColorsEnabled =
  stderrColorsEnabled === false || process.stdout.isTTY !== true ? false : true;

const LEVELS = {
  error: 0,
  warning: 1,
  output: 2,
  info: 3,
  debug: 4,
  verbose: 5,
} as const;
type Levels = typeof LEVELS;

export const defaultTransport: Transport = (log) => {
  if (log.level === LEVELS.output) {
    const formatted = formatWithOptions(
      { colors: stdoutColorsEnabled },
      ...log.args,
    );
    process.stdout.write(`${formatted}\n`);
  } else {
    const formatted = formatWithOptions(
      { colors: stderrColorsEnabled },
      ...log.args,
    );
    process.stderr.write(`${formatted}\n`);
  }
};

class Logger {
  private _transport: Transport = defaultTransport;
  private _chalk: ChalkInstance = new Chalk({
    // chalk takes the more strict version of stdout because we can't be sure which log level it is used
    level: stdoutColorsEnabled ? 2 : 0,
  });

  public LEVELS: Levels = LEVELS;

  public setTransport(transport: Transport): void {
    this._transport = transport;
  }

  public get color(): ChalkInstance {
    return this._chalk;
  }

  public error(...args: unknown[]): void {
    this._transport({ date: new Date(), level: LEVELS.error, args });
  }
  public warning(...args: unknown[]): void {
    this._transport({ date: new Date(), level: LEVELS.warning, args });
  }
  public output(...args: unknown[]): void {
    this._transport({ date: new Date(), level: LEVELS.output, args });
  }
  public info(...args: unknown[]): void {
    this._transport({ date: new Date(), level: LEVELS.info, args });
  }
  public debug(...args: unknown[]): void {
    this._transport({ date: new Date(), level: LEVELS.debug, args });
  }
  public verbose(...args: unknown[]): void {
    this._transport({ date: new Date(), level: LEVELS.verbose, args });
  }
}

export const log = new Logger();
