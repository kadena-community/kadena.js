import { dotenv } from './dotenv';
import type { Debug } from 'debug';

interface ILogger {
  (context: string): {
    debug: (message: string) => void;
    info: (message: string) => void;
    warn: (message: string) => void;
  };
}

const consoleLogger: ILogger = (context) => ({
  debug(message) {
    console.log(`${context} DEBUG: ${message}`);
  },
  info(message) {
    console.log(`${context} INFO: ${message}`);
  },
  warn(message) {
    console.log(`${context} WARNING: ${message}`);
  },
});

const debugLogger: ILogger = (context) => {
  const _debug = require('debug') as Debug;
  const debug = _debug(context);

  return {
    debug(message) {
      debug(`DEBUG: ${message}`);
    },
    info(message) {
      debug(`INFO: ${message}`);
    },
    warn(message) {
      debug(`WARNING: ${message}`);
    },
  };
};

let logger: ReturnType<ILogger> | undefined = undefined;

const loggers: Record<'console' | 'debug' | 'file', ILogger> = {
  console: consoleLogger,
  debug: debugLogger,
  file: consoleLogger,
};

export const createLogger: ILogger = (context) => {
  if (logger === undefined) {
    if (dotenv.LOGGER !== undefined) {
      logger = loggers[dotenv.LOGGER](context);
    } else {
      logger = consoleLogger(context);
    }
  }

  return logger;
};
