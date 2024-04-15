import type { EncryptedString } from '@kadena/hd-wallet';
import { z } from 'zod';

export const WALLET_SCHEMA_VERSION = 1;

export const walletSchema = z.object({
  alias: z.string(),
  seed: z.string().transform((v) => v as EncryptedString),
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
