import * as _dotenv from 'dotenv';

_dotenv.config();

export const dotenv: {
  CHAIN_COUNT: number;
  COMPLEXITY_LIMIT: number;
  COMPLEXITY_ENABLED: boolean;
  COMPLEXITY_EXPOSED: boolean;
  DATABASE_URL: string;
  MAX_CALCULATED_BLOCK_CONFIRMATION_DEPTH: number;
  NETWORK_HOST: string;
  NETWORK_ID: string;
  PORT: number;
  TRACING_ENABLED: boolean;
  TRACING_LOG_FILENAME: string;
} = {
  CHAIN_COUNT: parseInt(or(process.env.CHAIN_COUNT, '20'), 10),
  COMPLEXITY_LIMIT: parseInt(or(process.env.COMPLEXITY_LIMIT, '500'), 10),
  COMPLEXITY_ENABLED: or(process.env.COMPLEXITY_ENABLED === 'true', false),
  COMPLEXITY_EXPOSED: or(process.env.COMPLEXITY_EXPOSED === 'true', false),
  DATABASE_URL: or(
    process.env.DATABASE_URL,
    'postgresql://devnet@localhost:5432/devnet',
  ),
  MAX_CALCULATED_BLOCK_CONFIRMATION_DEPTH: parseInt(
    or(process.env.MAX_CALCULATED_BLOCK_CONFIRMATION_DEPTH, '11'),
    10,
  ),
  NETWORK_HOST: or(process.env.NETWORK_HOST, 'localhost:8080'),
  NETWORK_ID: or(process.env.NETWORK_ID, 'fast-development'),
  PORT: parseInt(or(process.env.PORT, '4000'), 10),
  TRACING_ENABLED: or(process.env.TRACING_ENABLED === 'true', false),
  TRACING_LOG_FILENAME: or(process.env.TRACING_LOG_FILENAME, 'traces.log'),
};

function or<T>(value: T | undefined, otherwise: T): T {
  return value === undefined ? otherwise : value;
}
