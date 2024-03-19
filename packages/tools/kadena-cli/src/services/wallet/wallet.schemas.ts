import { z } from 'zod';

export const WALLET_SCHEMA_VERSION = 1;

export const walletSchema = z.object({
  alias: z.string(),
  mnemonic: z.string(),
  legacy: z.boolean().optional(),
  version: z.number(),
  keys: z.array(
    z.object({
      publicKey: z.string(),
      index: z.number(),
      alias: z.string().optional(),
    }),
  ),
});
