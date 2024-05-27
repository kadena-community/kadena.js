import { isValid } from 'date-fns';
import { TEMP_DIR, promiseExec } from '../../utils/build';

/**
 * try to get the lastmodified date from the git logs of a particular file
 * if not exists then return current date
 */
export const getLastModifiedDate = async (root: string): Promise<string> => {
  const rootArray = root.split('/');
  const filename = rootArray.pop();
  const newRoot = rootArray.join('/');

  try {
    const { stdout } = await promiseExec(
      `cd ${TEMP_DIR} && cd ${newRoot} && git log -1 --pretty="format:%ci" ${filename}`,
    );
    const date = new Date(stdout);
    if (!isValid(date)) {
      const date = new Date();
      return date.toUTCString();
    }

    return date.toUTCString();
  } catch (e) {
    const date = new Date();

    return date.toUTCString();
  }
};
