import { installSnap } from '@metamask/snaps-jest';
import { MOCK_MAINNET, MOCK_TESTNET } from './helpers/test-data';
import { withId } from './helpers/test-utils';

describe('kda_deleteNetwork', () => {
  it('should delete a custom network correctly', async () => {
    const { request } = await installSnap();

    const MOCK_CUSTOM_NETWORK = {
      ...MOCK_MAINNET,
      name: 'Custom Kadena Network',
      networkId: 'custom01',
    };

    const response = request({
      method: 'kda_storeNetwork',
      params: {
        network: MOCK_CUSTOM_NETWORK,
      },
    });
    const ui = await response.getInterface({ timeout: 50000 });
    await ui.ok();
    await response;

    let networksResponse: any = await request({
      method: 'kda_getNetworks',
    });

    expect(networksResponse).toRespondWith([
      withId(MOCK_MAINNET),
      withId(MOCK_TESTNET),
      withId(MOCK_CUSTOM_NETWORK),
    ]);

    const deleteDialog = request({
      method: 'kda_deleteNetwork',
      params: {
        id: networksResponse.response.result[2].id,
      },
    });

    const deleteUi = await deleteDialog.getInterface({ timeout: 50000 });
    await deleteUi.ok();
    await deleteDialog;

    networksResponse = await request({
      method: 'kda_getNetworks',
    });

    expect(networksResponse).toRespondWith([
      withId(MOCK_MAINNET),
      withId(MOCK_TESTNET),
    ]);
  });

  it('should throw an error when trying to delete a non-existing network', async () => {
    const { request } = await installSnap();

    const response = await request({
      method: 'kda_deleteNetwork',
      params: {
        id: 'non-existing-id',
      },
    });

    expect(response).toRespondWithError({
      code: -32600,
      message: 'Network does not exist',
      stack: expect.any(String),
    });
  });

  it('should not delete the network if the user does not confirm the deletion', async () => {
    const { request } = await installSnap();

    const MOCK_CUSTOM_NETWORK = {
      ...MOCK_MAINNET,
      name: 'Another Custom Network',
      id: 'custom02',
    };

    const storeResponse = request({
      method: 'kda_storeNetwork',
      params: {
        network: MOCK_CUSTOM_NETWORK,
      },
    });
    const storeUi = await storeResponse.getInterface({ timeout: 50000 });
    await storeUi.ok();
    await storeResponse;

    let networksResponse: any = await request({
      method: 'kda_getNetworks',
    });

    expect(networksResponse).toRespondWith([
      withId(MOCK_MAINNET),
      withId(MOCK_TESTNET),
      withId(MOCK_CUSTOM_NETWORK),
    ]);

    networksResponse = await request({
      method: 'kda_getNetworks',
    });

    const deleteDialog = request({
      method: 'kda_deleteNetwork',
      params: {
        id: networksResponse.response.result[2].id,
      },
    });

    const deleteUi = await deleteDialog.getInterface({ timeout: 50000 });

    if (deleteUi.type === 'confirmation') {
      console.log(
        'User did not confirm the deletion. The network should remain unchanged.',
      );
    }

    networksResponse = await request({
      method: 'kda_getNetworks',
    });

    expect(networksResponse).toRespondWith([
      withId(MOCK_MAINNET),
      withId(MOCK_TESTNET),
      withId(MOCK_CUSTOM_NETWORK),
    ]);
  });
});
