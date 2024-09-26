import { config } from 'dotenv';
import { join } from 'path';

config({
  path: [join(__dirname, './.faucet.env'), join(__dirname, './.env')],
});

export const env = (key: string) => {
  if (process.env[key] === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  // console.log(key, process.env[key]);
  return (process.env[key] || '') as any;
};
