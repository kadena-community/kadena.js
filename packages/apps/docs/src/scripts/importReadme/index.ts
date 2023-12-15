import type { IScriptResult } from '../types';
import { importReadMes } from '../utils';
import { TEMP_DIR, promiseExec } from '../utils/build';
import { importRepo } from './importRepo';

const errors: string[] = [];
const success: string[] = [];

export const removeRepoDomain = (repo: string): string =>
  repo.replace(/https:\/\/github.com/, '');

export const clone = async (repo: string): Promise<void> => {
  try {
    await promiseExec(
      `git clone https://github.com${removeRepoDomain(
        repo,
      )} ${TEMP_DIR}/${removeRepoDomain(repo)}`,
    );
  } catch (e) {
    await Promise.resolve();
  }
};

export const importAllReadmes = async (): Promise<IScriptResult> => {
  const monorepoCount = 0;
  let outsideCount = 0;

  for (const item of importReadMes) {
    outsideCount++;
    await importRepo(item);
  }

  success.push(
    `Docs imported from monorepo(${monorepoCount}) and outside repos(${outsideCount})`,
  );

  return { success, errors };
};
