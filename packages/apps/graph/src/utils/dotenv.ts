import * as _dotenv from 'dotenv';

_dotenv.config();

export const dotenv: {
  CHAIN_COUNT: number;
  NETWORK_HOST: string;
  NETWORK_ID: string;
  MAX_BLOCK_DEPTH: number;
  DATABASE_URL: string;
} = {
  CHAIN_COUNT: parseInt(or(process.env.CHAIN_COUNT, '20'), 10),
  NETWORK_HOST: or(process.env.NETWORK_HOST, 'localhost:8080'),
  NETWORK_ID: or(process.env.NETWORK_ID, 'fast-development'),
  MAX_BLOCK_DEPTH: parseInt(
    or(process.env.MAX_CALCULATED_BLOCK_CONFIRMATION_DEPTH, '51'),
    10,
  ),
  DATABASE_URL: or(
    process.env.DATABASE_URL,
    'postgresql://devnet@localhost:5432/devnet',
  ),
};

function or<T>(value: T | undefined, otherwise: T): T {
  return value === undefined ? otherwise : value;
}
