import type { IQuestion } from '../utils/helpers';

import type { TConfigOptions } from './configQuestions';
import { configQuestions } from './configQuestions';

interface IProjectNameQuestion
  extends Pick<IQuestion<TConfigOptions>, 'key' | 'prompt'> {}

// Filter the question objects where key is 'projectName'
export const projectNameQuestion: IProjectNameQuestion[] =
  configQuestions.filter((question) => question.key === 'projectName');
