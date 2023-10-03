import { isValid } from 'date-fns';
import { exec } from 'child_process';
import { promisify } from 'util';

export const getSubDirLastModifiedDate = async (root, subdir) => {
  const promiseExec = promisify(exec);

  const { stdout } = await promiseExec(
    `cd ${subdir} && git log -1 --pretty="format:%ci" ${root}`,
  );

  const date = new Date(stdout);
  if (!isValid(date)) return;

  return date.toUTCString();
};

export const getLastModifiedDate = async (root) => {
  const promiseExec = promisify(exec);

  const { stdout } = await promiseExec(
    `git log -1 --pretty="format:%ci" ${root}`,
  );

  const date = new Date(stdout);
  if (!isValid(date)) return;

  return date.toUTCString();
};
