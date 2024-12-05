import { assertIsConfirmationDialog, installSnap } from '@metamask/snaps-jest';

describe('kda_getActiveNetwork', () => {
  it('should return the current active network', async () => {
    const { request } = await installSnap();

    const activeNetwork: any = await request({
      method: 'kda_getActiveNetwork',
    });

    const networks: any = await request({
      method: 'kda_getNetworks',
    });

    expect(activeNetwork).toRespondWith(networks.response.result[0].id);
  });

  it('should set and return the updated active network', async () => {
    const { request } = await installSnap();

    const initial: any = await request({
      method: 'kda_getActiveNetwork',
    });

    const networks: any = await request({
      method: 'kda_getNetworks',
    });

    expect(initial).toRespondWith(networks.response.result[0].id);

    const setNetworkResponse: any = request({
      method: 'kda_setActiveNetwork',
      params: {
        id: networks.response.result[1].id,
      },
    });

    const ui = await setNetworkResponse.getInterface({ timeout: 50000 });
    assertIsConfirmationDialog(ui);
    await ui.ok();
    await setNetworkResponse;

    const response: any = await request({
      method: 'kda_getActiveNetwork',
    });

    expect(response).toRespondWith(networks.response.result[1].id);
  });
});
