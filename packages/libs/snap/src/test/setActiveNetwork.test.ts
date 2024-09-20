import { assertIsConfirmationDialog, installSnap } from '@metamask/snaps-jest';

describe('kda_setActiveNetwork ', () => {
  it('gets and sets the current active network properly', async () => {
    const { request } = await installSnap();

    const networks: any = await request({
      method: 'kda_getNetworks',
    });

    // Initially the network 0 it's active
    let response = await request({
      method: 'kda_getActiveNetwork',
    });

    expect(response).toRespondWith(networks.response.result[0].id);

    const dialog = request({
      method: 'kda_setActiveNetwork',
      params: {
        id: networks.response.result[1].id,
      },
    });

    const ui = await dialog.getInterface({ timeout: 50000 });
    assertIsConfirmationDialog(ui);
    await ui.ok();
    await dialog;

    // Now the network 1 it's active
    response = await request({
      method: 'kda_getActiveNetwork',
    });

    expect(response).toRespondWith(networks.response.result[1].id);
  });

  it('throws an error if the network does not exist', async () => {
    const { request } = await installSnap();

    const response = await request({
      method: 'kda_setActiveNetwork',
      params: {
        id: 'invalid',
      },
    });

    expect(response).toRespondWithError({
      code: -32600,
      message: 'Network not found',
      stack: expect.any(String),
    });
  });
});
