import { getLoadingData } from '../getLoadingData';

describe('getLoadingData', () => {
  it('should return the loading data', () => {
    const result = getLoadingData();
    expect(result.chainId).toEqual('');
    expect(result.data.edges.length).toEqual(20);
  });
});
