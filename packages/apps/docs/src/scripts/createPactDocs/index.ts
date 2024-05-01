import type { IScriptResult } from '@kadena/docs-tools';

const errors: string[] = [];
const success: string[] = [];

export const createPactDocs = async (): Promise<IScriptResult> => {
  errors.length = 0;
  success.length = 0;

  if (!errors.length) {
    success.push('pact docs created');
  }
  return { errors, success };
};
