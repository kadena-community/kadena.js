import { z } from 'zod';

export const accountSchema = z.object({
  alias: z.string(),
  name: z.string(),
  fungible: z.string(),
  publicKeys: z.array(z.string()).nonempty(),
  predicate: z.string(),
});
