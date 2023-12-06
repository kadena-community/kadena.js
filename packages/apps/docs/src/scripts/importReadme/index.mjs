import { promiseExec } from './../build.mjs';
import { importReadMes } from './../utils.mjs';
import { TEMPDIR } from './createDoc.mjs';
import { importRepo } from './importRepo.mjs';

const errors = [];
const success = [];

export const removeRepoDomain = (repo) =>
  repo.replace(/https:\/\/github.com/, '');

export const clone = async (repo) => {
  try {
    await promiseExec(
      `git clone https://github.com${removeRepoDomain(
        repo,
      )} ${TEMPDIR}/${removeRepoDomain(repo)}`,
    );
  } catch (e) {
    Promise.resolve();
  }
};

export const importAllReadmes = async () => {
  let monorepoCount = 0;
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
