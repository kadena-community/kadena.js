import z from 'zod';

export const plainKeySchema = z.object({
  publicKey: z.string(),
  secretKey: z.string(),
  legacy: z.boolean().optional(),
});
