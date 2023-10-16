import * as _dotenv from 'dotenv';

_dotenv.config();

export const dotenv: {
  CHAIN_COUNT: number;
  DATABASE_URL: string | undefined;
  MAX_BLOCK_DEPTH: number;
} = {
  CHAIN_COUNT: parseInt(or(process.env.CHAIN_COUNT, '20'), 10),
  DATABASE_URL: process.env.DATABASE_URL,
  MAX_BLOCK_DEPTH: parseInt(
    or(process.env.MAX_CALCULATED_BLOCK_CONFIRMATION_DEPTH, '51'),
    10,
  ),
};

function or<T>(value: T | undefined, otherwise: T): T {
  return value === undefined ? otherwise : value;
}
