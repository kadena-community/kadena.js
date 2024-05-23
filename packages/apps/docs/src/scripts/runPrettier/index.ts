import type { IScriptResult } from '@kadena/docs-tools';
import { promiseExec } from '../utils/build';

export const runPrettier = async (): Promise<IScriptResult> => {
  const success: string[] = [];
  const errors: string[] = [];

  const { stderr } = await promiseExec(
    `pnpm prettier ./src/pages --write && pnpm prettier ./src/_generated/**/*.json && pnpm prettier ./src/data/changelogs.json --write`,
  );

  if (stderr) {
    errors.push(`Prettier had issues: ${stderr}`);
  } else {
    success.push('Prettier done!!');
  }

  return { errors, success };
};
