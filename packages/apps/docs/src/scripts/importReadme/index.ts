import type { IImportReadMeItem } from '../utils';
import { TEMP_DIR, promiseExec } from '../utils/build';

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
export const checkoutClone = async (item: IImportReadMeItem): Promise<void> => {
  if (!item.repo || !item.repoBranch) return;
  try {
    await promiseExec(
      `cd ${TEMP_DIR}/${removeRepoDomain(item.repo)} && git checkout ${item.repoBranch}`,
    );
  } catch (e) {
    await Promise.resolve();
  }
};
