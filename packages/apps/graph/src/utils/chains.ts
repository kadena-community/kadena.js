import { dotenv } from './dotenv';

export const chainIds = [...Array(dotenv.CHAIN_COUNT).keys()].map((i) =>
  i.toString(),
);
