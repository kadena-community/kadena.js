import type { ChalkInstance } from 'chalk';
import { Chalk } from 'chalk';
import jsYaml from 'js-yaml';
import { formatWithOptions } from 'node:util';
import z from 'zod';
import { maskSensitiveInfo } from './logger-utils.js';

/**
 * Custom logging class for kadena-cli
 *
 * The team considered multiple existing logging frameworks including:
 * consola, winston, pino
 *
 * However these all did not match the requirements we set out for CLI specific logging.
 *
 * The main hurdle was strict requirements about managing stdin/stderr/stdout and
 * the ability to disable colors depending on each stream individually being a TTY or not.
 *
 * This logging library is a simple implementation allowing flexibility for our requirements.
 */

interface IRecord {
  date: Date;
  level: LevelValue;
  args: unknown[];
}
type Transport = (record: IRecord, log: Logger) => void;

const ENV_LEVEL = process.env.KADENA_LOG;

// If in CI or other non-interactive environment, disable colors
const stderrColorsEnabled =
  process.stderr.isTTY !== true ||
  process.env.COLORS === 'false' ||
  process.env.COLORS === '0' ||
  process.env.NODE_DISABLE_COLORS === 'true' ||
  process.env.NODE_DISABLE_COLORS === '1' ||
  process.env.NO_COLOR === 'true' ||
  process.env.NO_COLOR === '1'
    ? false
    : true;

// Be more strict for stdout, only enable colors if stdout is a TTY
const stdoutColorsEnabled =
  stderrColorsEnabled === false || process.stdout.isTTY !== true ? false : true;

export const LEVELS = {
  error: 0,
  warning: 1,
  output: 2,
  header: 3,
  info: 4,
  debug: 5,
  verbose: 6,
} as const;

type Levels = typeof LEVELS;
type LevelKey = keyof Levels;
export type LevelValue = Levels[keyof Levels];

type OutputMode = 'plain' | 'json' | 'yaml';

/** Accepts levels as strings "info" or "3" and output as numbers */
const levelSchema = z.union([
  z
    .enum(Object.keys(LEVELS) as [LevelKey, ...LevelKey[]])
    .transform((level) => LEVELS[level] as LevelValue),
  z
    .enum(Object.values(LEVELS).map(String) as [string, ...string[]])
    .transform((level) => Number(level) as LevelValue),
]);

const stdOutChalk = new Chalk({ level: stdoutColorsEnabled ? 2 : 0 });
const stdErrChalk = new Chalk({ level: stderrColorsEnabled ? 2 : 0 });

export const defaultTransport: Transport = (record) => {
  // Give color to logs
  const NO_COLOR = (line: string): string => line;
  const LEVEL_COLORS = {
    [LEVELS.error]: stdErrChalk.red,
    [LEVELS.warning]: stdErrChalk.yellow,
    [LEVELS.output]: NO_COLOR,
    [LEVELS.info]: NO_COLOR,
    [LEVELS.debug]: stdErrChalk.gray,
    [LEVELS.verbose]: stdErrChalk.gray,
  } as Record<LevelValue, ChalkInstance>;
  const COLOR = LEVEL_COLORS[record.level] ?? NO_COLOR;

  // If level "output", write to stdout
  if (record.level === LEVELS.output) {
    const formatted = formatWithOptions(
      { colors: stdoutColorsEnabled },
      ...record.args,
    );
    process.stdout.write(
      `${stdoutColorsEnabled ? COLOR(formatted) : formatted}\n`,
    );
  } else {
    // Otherwise write to stderr
    const formatted = formatWithOptions(
      { colors: stderrColorsEnabled },
      ...record.args,
    );
    process.stderr.write(`${COLOR(formatted)}\n`);
  }
};

class Logger {
  private _transport: Transport = defaultTransport;
  // chalk takes the more strict version of stdout because we can't be sure which log level it is used
  private _chalk: ChalkInstance = stdOutChalk;
  private _outputMode: OutputMode = 'plain';

  public LEVELS: Levels = LEVELS;
  public level: LevelValue = LEVELS.info;

  public constructor(data?: { level?: LevelValue }) {
    if (data?.level !== undefined) {
      this.level = data.level;
    } else if (ENV_LEVEL !== undefined) {
      const parsed = levelSchema.safeParse(ENV_LEVEL);
      if (parsed.success) this.level = parsed.data;
    }
  }

  public setTransport(transport: Transport): void {
    this._transport = transport;
  }

  public setOutputMode(outputMode: OutputMode): void {
    this._outputMode = outputMode;
  }

  public setLevel(level: LevelValue): void {
    this.level = level;
  }

  public get color(): ChalkInstance {
    return this._chalk;
  }

  private _log(level: LevelValue, args: unknown[]): void {
    if (this.level >= level) {
      const processedArgs = args.map((arg) => maskSensitiveInfo(arg));
      this._transport({ date: new Date(), level, args: processedArgs }, this);
    }
  }

  public error(...args: unknown[]): void {
    this._log(LEVELS.error, args);
  }

  public warning(...args: unknown[]): void {
    this._log(LEVELS.warning, args);
  }

  public output(plain: string | null, formatted: unknown): void {
    if (this._outputMode === 'json') {
      this._log(LEVELS.output, [JSON.stringify(formatted, null, 2)]);
    } else if (this._outputMode === 'yaml') {
      this._log(LEVELS.output, [jsYaml.dump(formatted, { lineWidth: -1 })]);
    } else if (plain !== null) {
      this._log(LEVELS.output, [plain]);
    }
  }

  public info(...args: unknown[]): void {
    this._log(LEVELS.info, args);
  }

  public debug(...args: unknown[]): void {
    this._log(LEVELS.debug, args);
  }

  public verbose(...args: unknown[]): void {
    this._log(LEVELS.verbose, args);
  }
}

export const log = new Logger();
