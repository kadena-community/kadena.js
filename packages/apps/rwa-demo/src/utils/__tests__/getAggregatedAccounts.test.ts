import { getAggregatedAccounts } from '../getAggregatedAccounts';

describe('getAggregatedAccounts', () => {
  it('should return all the accounts if there are no doubles', () => {
    const accounts = [
      {
        to: 'k:heman',
        amount: '1',
      },
      {
        to: 'k:skeletor',
        amount: '1',
      },
      {
        to: 'k:cringer',
        amount: '1',
      },
    ];

    const result = getAggregatedAccounts(accounts);
    expect(result.length).toEqual(accounts.length);
  });

  it('should return all the non double accounts and the amounts should be aggregated on accounts', () => {
    const accounts = [
      {
        to: 'k:heman',
        amount: '1',
      },
      {
        to: 'k:skeletor',
        amount: '1',
      },
      {
        to: 'k:cringer',
        amount: '1',
      },
      {
        to: 'k:skeletor',
        amount: '1.7',
      },
    ];

    const result = getAggregatedAccounts(accounts);
    expect(result.length).toEqual(accounts.length - 1);
    expect(result[1].amount).toEqual('2.7');
  });
});
