import { CWD_KADENA_DIR, HOME_KADENA_DIR } from '../constants/config.js';
import type { IPrompt } from '../utils/createOption.js';
import { select } from '../utils/prompts.js';

export const configLocationPrompt: IPrompt<string> = async (
  previousQuestions,
  args,
  isOptional,
) => {
  return await select({
    message: 'Location of kadena config directory:',
    choices: [
      {
        value: CWD_KADENA_DIR,
        name: `Working directory:   ${CWD_KADENA_DIR}`,
      },
      {
        value: HOME_KADENA_DIR,
        name: `User home directory: ${HOME_KADENA_DIR}`,
      },
    ],
  });
};
