import * as dotenv from 'dotenv';

dotenv.config();

export const env: {
  CHAIN_COUNT: number;
  DATABASE_URL: string | undefined;
} = {
  CHAIN_COUNT: parseInt(or(process.env.CHAIN_COUNT, '20'), 10),
  DATABASE_URL: process.env.DATABASE_URL,
};

function or<T>(value: T | undefined, otherwise: T): T {
  return value === undefined ? otherwise : value;
}
