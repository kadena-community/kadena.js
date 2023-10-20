import { exec } from 'child_process';
import { isValid } from 'date-fns';
import { promisify } from 'util';

export const getLastModifiedDate = async (
  root: string,
): Promise<Date | undefined> => {
  const promiseExec = promisify(exec);

  const { stdout } = await promiseExec(
    `git log -1 --pretty="format:%ci" ${root}`,
  );

  const date = new Date(stdout);
  if (!isValid(date)) return;

  return date;
};

export const dateToString = (date?: Date): string | undefined =>
  date ? date.toUTCString() : undefined;
