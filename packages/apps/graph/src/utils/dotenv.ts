import * as _dotenv from 'dotenv';

_dotenv.config();

export const dotenv: {
  CHAIN_COUNT: number;
  USE_EMBEDDED_POSTGRES: boolean;
  DATABASE_URL: string | undefined;
  EMBEDDED_DATABASE_URL: string | undefined;
  LOGGER: 'console' | 'debug' | 'file' | undefined;
} = {
  CHAIN_COUNT: parseInt(or(process.env.CHAIN_COUNT, '20'), 10),
  USE_EMBEDDED_POSTGRES: process.env.USE_EMBEDDED_POSTGRES === 'true',
  DATABASE_URL: process.env.DATABASE_URL,
  EMBEDDED_DATABASE_URL: process.env.EMBEDDED_DATABASE_URL,
};

function or<T>(value: T | undefined, otherwise: T): T {
  return value === undefined ? otherwise : value;
}
