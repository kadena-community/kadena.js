import { removeRepoDomain } from '@/scripts/importReadme';
import { TEMP_DIR, promiseExec } from '@/scripts/utils/build';

// TODO: this is temporary to checkout the correct branch. we can use the normal clone function when done
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

  //TODO: remove the PR info
  await promiseExec(
    `cd ${TEMP_DIR}/${removeRepoDomain(repo)} && git checkout rsoeldner/docs`,
  );
};
