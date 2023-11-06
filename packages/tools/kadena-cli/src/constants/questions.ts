import { z } from "zod";
import { accountPrompt } from "./prompts.js";
import { account } from "./options.js";

// eslint-disable-next-line @rushstack/typedef-var
export const Questions = z.object({
  account: z
    .string(),
    // .min(60, { message: 'Account must be 60 or more characters long' })
    // .startsWith('k:', { message: 'Account should start with k:' }),
  chainId: z
    .number({
      /* eslint-disable-next-line @typescript-eslint/naming-convention */
      invalid_type_error: 'Error: -c, --chain must be a number',
    })
    .min(0)
    .max(19),
  network: z.string({}),
  networkId: z.string().optional(),
  networkHost: z.string().optional(),
  networkExplorerUrl: z.string().optional(),
});

export const options = {
  account: {
    prompt: accountPrompt,
    validation: z.string(),
    option: new Option('-a, --account <account>', 'Receiver (k:) wallet address'),
  },
  chainId: {

  },
  network: z.string({}),
};

export const chainId = z.number();

export type TQuestions = z.infer<typeof Questions>;


