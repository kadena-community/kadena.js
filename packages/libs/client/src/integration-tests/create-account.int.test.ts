import { fund } from './util/simple-transfer';

describe('Fund account', () => {
  it('should fund the account', async () => {
    await fund(
      'k:2f48080efe54e6eb670487f664bcaac7684b4ebfcfc8a3330ef080c9c97f7e11',
      '2f48080efe54e6eb670487f664bcaac7684b4ebfcfc8a3330ef080c9c97f7e11',
      { decimal: '100' },
    );
    console.log('Add 100 KDA');
  }, 100000);
});
