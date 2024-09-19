import { installSnap } from '@metamask/snaps-jest';
import { MOCK_MAINNET, MOCK_TESTNET } from './helpers/test-data';
import { withId } from './helpers/test-utils';

describe('kda_storeNetwork', () => {
  it('Should store and correctly return the network', async () => {
    const { request } = await installSnap();

    const networks: any = await request({
      method: 'kda_getNetworks',
    });

    expect(networks).toRespondWith([
      withId(MOCK_MAINNET),
      withId(MOCK_TESTNET),
    ]);

    const MOCK_NEW_MAINNET = {
      ...MOCK_MAINNET,
      name: 'New Kadena Mainnet',
    };

    const newNetworkResponse = request({
      method: 'kda_storeNetwork',
      params: {
        network: MOCK_NEW_MAINNET,
      },
    });
    const ui = await newNetworkResponse.getInterface({ timeout: 50000 });
    await ui.ok();
    const newNetwork = await newNetworkResponse;

    expect(newNetwork).toRespondWith(withId(MOCK_NEW_MAINNET));

    const networks2: any = await request({
      method: 'kda_getNetworks',
    });

    expect(networks2).toRespondWith([
      withId(MOCK_MAINNET),
      withId(MOCK_TESTNET),
      withId(MOCK_NEW_MAINNET),
    ]);
  });

  it('Should reject existing network name', async () => {
    const { request } = await installSnap();

    const newNetworkResponse = await request({
      method: 'kda_storeNetwork',
      params: {
        network: MOCK_MAINNET,
      },
    });

    expect(newNetworkResponse).toRespondWithError({
      code: -32600,
      message: 'Network Kadena Mainnet already exists',
      stack: expect.any(String),
    });
  });

  it('Should reject invalid network data', async () => {
    const { request } = await installSnap();

    const newNetworkResponse = await request({
      method: 'kda_storeNetwork',
      params: {
        network: {
          ...MOCK_MAINNET,
          nodeUrl: null as unknown as string,
        },
      },
    });

    expect(newNetworkResponse).toRespondWithError({
      code: -32602,
      message:
        '1 parameter validation error: "nodeUrl: expected string received object"',
      stack: expect.any(String),
    });
  });
});
