import type { IScriptResult } from '@kadena/docs-tools';
import { loadConfigPages } from '../movePages/utils/loadConfigPages';

import { errors, success } from './utils/constants';
import { copyPages } from './utils/copyPages';

export const createPactDocs = async (): Promise<IScriptResult> => {
  errors.length = 0;
  success.length = 0;

  const pages = loadConfigPages();
  try {
    await copyPages(pages);
  } catch (e) {
    errors.push(e);
  }

  if (!errors.length) {
    success.push('pact docs created');
  }
  return { errors, success };
};
