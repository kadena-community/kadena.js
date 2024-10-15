interface ILogObject {
  level: number;
  message: string;
  data?: Record<string, unknown>;
  timestamp: number;
}
export type ILogTransport = (log: ILogObject) => void;

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

export type LogLevel = keyof typeof LOG_LEVELS;

export class Logger {
  private _transport?: ILogTransport;
  private _level: number = LOG_LEVELS.WARN;
  private _noTransportWarned: boolean = false;

  public constructor(level: LogLevel, transport?: ILogTransport) {
    this._transport = transport;
    this._level = LOG_LEVELS[level];
  }

  public setLevel(level: LogLevel) {
    this._level = LOG_LEVELS[level];
  }

  private _log(level: number, message: string, data?: Record<string, unknown>) {
    if (!this._transport) {
      if (!this._noTransportWarned) {
        // eslint-disable-next-line no-console
        console.warn(
          '[WalletSDK] logTransport not set. Enable it to receive logs.',
        );
        this._noTransportWarned = true;
      }
      return;
    }
    this._transport({
      level,
      message,
      data,
      timestamp: Date.now(),
    });
  }

  public debug(message: string, data?: Record<string, unknown>) {
    if (this._level < LOG_LEVELS.DEBUG) return;
    this._log(LOG_LEVELS.DEBUG, message, data);
  }

  public info(message: string, data?: Record<string, unknown>) {
    if (this._level < LOG_LEVELS.INFO) return;
    this._log(LOG_LEVELS.INFO, message, data);
  }

  public warn(message: string, data?: Record<string, unknown>) {
    if (this._level < LOG_LEVELS.WARN) return;
    this._log(LOG_LEVELS.WARN, message, data);
  }

  public error(message: string, data?: Record<string, unknown>) {
    if (this._level < LOG_LEVELS.ERROR) return;
    this._log(LOG_LEVELS.ERROR, message, data);
  }
}
