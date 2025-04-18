import type { IChainAccount } from '../../constants';
import { creatLowChainsString } from '../creatLowChainsString';

describe('Utils', () => {
  describe('creatLowChainsString', () => {
    it('should return an empty string if array is empty', () => {
      const chains: IChainAccount[] = [];
      const result = creatLowChainsString(chains);
      expect(result).toEqual('');
    });

    it('should return the correct string if array is not empty', () => {
      const chains: IChainAccount[] = [
        {
          balance: 1000,
          chainId: '1',
        },
      ];
      const result = creatLowChainsString(chains);
      expect(result).toEqual('*chain 1:* (1,000 KDA)');

      const chains2: IChainAccount[] = [
        {
          balance: 1000,
          chainId: '1',
        },
        {
          balance: 1977,
          chainId: '9',
        },
      ];
      const result2 = creatLowChainsString(chains2);
      expect(result2).toEqual('*chain 1:* (1,000 KDA)\n*chain 9:* (1,977 KDA)');
    });
  });
});
