import { collectResponses } from '../utils/helpers';

import { displayGeneralConfig, getProjectConfig } from './configHelpers';
import type { TConfigOptions } from './configQuestions';
import { ConfigOptions } from './configQuestions';
import { projectNameQuestions } from './infoQuestions';

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
