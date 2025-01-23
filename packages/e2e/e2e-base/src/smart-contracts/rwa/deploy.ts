import { exec } from 'child_process';
import { promisify } from 'util';

export const deployRWA = async () => {
  const promiseExec = await promisify(exec);

  try {
    await promiseExec(
      `git clone git@github.com:kadena-io/RWA-token.git ./.tempimport/RWA-token`,
    );
  } catch (e) {
    await Promise.resolve();
  }

  const result = await promiseExec(
    `cd ./../e2e-rwa-demo/.tempimport/RWA-token/deploy-mvp && npm i`,
  );

  console.log({ result });
  return true;
};
