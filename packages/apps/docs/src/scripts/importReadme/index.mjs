import { importReadMes } from './../utils.mjs';
import { importDocs } from './createDoc.mjs';
import { importRepo } from './importRepo.mjs';

const errors = [];
const success = [];

export const importAllReadmes = async () => {
  importReadMes.forEach(async (item) => {
    if (item.repo) {
      await importRepo(item);
    } else {
      await importDocs(`./../../${item.file}`, item);
    }
  });

  success.push('Docs imported from monorepo');

  return { success, errors };
};
