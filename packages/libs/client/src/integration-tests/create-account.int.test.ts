import { fund } from './util/simple-transfer';

import before, { describe } from 'node:test';

describe('Fund account', async () => {
  await before(async () => {
    await fund(
      'k:2f48080efe54e6eb670487f664bcaac7684b4ebfcfc8a3330ef080c9c97f7e11',
      '2f48080efe54e6eb670487f664bcaac7684b4ebfcfc8a3330ef080c9c97f7e11',
      { decimal: '100' },
    );
    console.log('Add 100 KDA');
  });
});
