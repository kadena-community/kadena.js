import { collectResponses } from '../utils/helpers.js';

import { displayGeneralConfig, getProjectConfig } from './configHelpers.js';
import type { TConfigOptions } from './configQuestions.js';
import { ConfigOptions } from './configQuestions.js';
import { projectNameQuestions } from './infoQuestions.js';

import chalk from 'chalk';
import debug from 'debug';

export type IShowConfigurationArgs = Pick<TConfigOptions, 'projectName'>;

export const showConfigurationAction = async (
  args: IShowConfigurationArgs,
): Promise<void> => {
  debug('init:action')({ args });

  const responses = await collectResponses(args, projectNameQuestions);

  const config = { ...args, ...responses };

  ConfigOptions.pick({ projectName: true }).parse(config);

  try {
    // existing projects have a prefix
    displayGeneralConfig(getProjectConfig(config.projectName.toLowerCase()));
  } catch (e) {
    console.error(
      chalk.red(
        `Project config file '${config.projectName.toLowerCase()}' not found`,
      ),
    );
  }
};
