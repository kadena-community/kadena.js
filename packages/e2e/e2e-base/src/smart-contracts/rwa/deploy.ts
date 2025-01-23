import { exec } from 'child_process';
import { promisify } from 'util';

export const deployRWA = async () => {
  const promiseExec = await promisify(exec);
  const TEMP_DIR = './.tempimport';

  try {
    await promiseExec(
      `git clone git@github.com:kadena-io/RWA-token.git ${TEMP_DIR}/RWA-token`,
    );
  } catch (e) {
    await Promise.resolve();
  }

  const result = await promiseExec(
    `cd ${__dirname}/../../../../e2e-rwa-demo/${TEMP_DIR}/RWA-token/deploy-mvp && npm i`,
  );

  console.log({ result });
  return true;
};
