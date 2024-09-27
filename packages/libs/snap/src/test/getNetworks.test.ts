import { installSnap } from '@metamask/snaps-jest';
import { MOCK_MAINNET, MOCK_TESTNET } from './helpers/test-data';
import { withId } from './helpers/test-utils';

// kda_getNetworks is tested more thoroughly in the `storeNetwork.test.ts`
describe('kda_getNetworks', () => {
  it('Gets current networks', async () => {
    const { request } = await installSnap();

    const networks: any = await request({
      method: 'kda_getNetworks',
    });

    expect(networks).toRespondWith([
      withId(MOCK_MAINNET),
      withId(MOCK_TESTNET),
    ]);
  });
});
