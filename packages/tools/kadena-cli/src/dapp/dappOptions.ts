import { Option } from 'commander';
import { z } from 'zod';
import { genericActionsPrompts } from '../prompts/index.js';
import { createOption } from '../utils/createOption.js';

export const dappOptions = {
  dappTemplate: createOption({
    key: 'dappTemplate',
    prompt: genericActionsPrompts.actionAskForDappTemplate,
    validation: z.string(),
    option: new Option(
      '-t, --dapp-template <dappTemplate>',
      'Template to create sample dApp(e.g. angular, nextjs, vuejs)',
    ),
  }),
};
