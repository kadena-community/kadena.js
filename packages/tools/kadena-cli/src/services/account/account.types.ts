import type { z } from 'zod';
import type { accountSchema } from './account.schemas.js';

export interface IAccountCreate {
  alias: string;
  name: string;
  fungible: string;
  publicKeys: string[];
  predicate: string;
}

export type IAccountFile = z.output<typeof accountSchema>;

export interface IAccount {
  alias: string;
  name: string;
  fungible: string;
  publicKeys: string[];
  predicate: string;
  filepath: string;
}
