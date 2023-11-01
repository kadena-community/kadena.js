import { importReadMes } from './../utils.mjs';
import { importDocs } from './createDoc.mjs';
import { importRepo } from './importRepo.mjs';

const errors = [];
const success = [];

export const importAllReadmes = async () => {
  let monorepoCount = 0;
  let outsideCount = 0;
  const promises = importReadMes.map((item) => {
    if (item.repo) {
      outsideCount++;
      return importRepo(item);
    } else {
      monorepoCount++;
      return importDocs(`./../../${item.file}`, item);
    }
  });

  await Promise.all(promises);

  success.push(
    `Docs imported from monorepo(${monorepoCount}) and outside repos(${outsideCount})`,
  );

  return { success, errors };
};
