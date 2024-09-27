import { config } from 'dotenv';
import { join } from 'path';

config({
  path: [join(__dirname, './.env')],
});

export const env = (
  key: string,
  defaultValue: undefined | string = undefined,
) => {
  if (
    (process.env[key] === undefined || process.env[key] === '') &&
    defaultValue === undefined
  ) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return (process.env[key] || defaultValue) as any;
};
