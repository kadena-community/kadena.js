import { z } from 'zod';

export const CONTRACT_RETRIEVAL_SCHEMA = z.object({
  module: z.string(),
  apiHost: z.string().url(),
  chain: z.union([z.number(), z.string()]),
  network: z.string(),
});

export const CONTRACT_GENERATE_OPTIONS_SCHEMA = z.object({
  clean: z.boolean().optional(),
  capsInterface: z.string().optional(),
  file: z.array(z.string()).optional(),
  contract: z.array(z.string()).optional(),
  namespace: z.string().optional(),
  api: z.string().optional(),
  chain: z.union([z.number(), z.string()]).optional(),
  network: z.string().optional(),
  parseTreePath: z.string().optional(),
});
