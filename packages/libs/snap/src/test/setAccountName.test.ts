import { installSnap } from '@metamask/snaps-jest';

describe('kda_setAccountName', () => {
  it('renames the account properly', async () => {
    const { request } = await installSnap();

    // Derive account 2
    await request({
      method: 'kda_addAccount',
    });

    let response: any = await request({
      method: 'kda_getAccounts',
    });

    expect(response).toRespondWith([
      {
        id: expect.any(String),
        address:
          'k:62bb7cf156ccfbe17bd6ca5460098ca9398a4aa3f04bd617f7a721b6e2e5aac7',
        index: 0,
        name: 'Kadena Account 1',
        publicKey:
          '0x0062bb7cf156ccfbe17bd6ca5460098ca9398a4aa3f04bd617f7a721b6e2e5aac7',
      },
      {
        id: expect.any(String),
        address:
          'k:cbc0df2219a816f2874d206987e34a206997b206ed62878ba902c3e3e5cb1bd9',
        index: 1,
        name: 'Kadena Account 2',
        publicKey:
          '0x00cbc0df2219a816f2874d206987e34a206997b206ed62878ba902c3e3e5cb1bd9',
      },
    ]);

    // Rename account 1
    await request({
      method: 'kda_setAccountName',
      params: {
        id: response.response.result[0].id,
        name: 'Kadena Renamed 1',
      },
    });

    response = await request({
      method: 'kda_getAccounts',
    });

    expect(response).toRespondWith([
      {
        id: expect.any(String),
        address:
          'k:62bb7cf156ccfbe17bd6ca5460098ca9398a4aa3f04bd617f7a721b6e2e5aac7',
        index: 0,
        name: 'Kadena Renamed 1',
        publicKey:
          '0x0062bb7cf156ccfbe17bd6ca5460098ca9398a4aa3f04bd617f7a721b6e2e5aac7',
      },
      {
        id: expect.any(String),
        address:
          'k:cbc0df2219a816f2874d206987e34a206997b206ed62878ba902c3e3e5cb1bd9',
        index: 1,
        name: 'Kadena Account 2',
        publicKey:
          '0x00cbc0df2219a816f2874d206987e34a206997b206ed62878ba902c3e3e5cb1bd9',
      },
    ]);

    // Rename account 2
    await request({
      method: 'kda_setAccountName',
      params: {
        id: response.response.result[1].id,
        name: 'Kadena Renamed 2',
      },
    });

    response = await request({
      method: 'kda_getAccounts',
    });
    expect(response).toRespondWith([
      {
        id: expect.any(String),
        address:
          'k:62bb7cf156ccfbe17bd6ca5460098ca9398a4aa3f04bd617f7a721b6e2e5aac7',
        index: 0,
        name: 'Kadena Renamed 1',
        publicKey:
          '0x0062bb7cf156ccfbe17bd6ca5460098ca9398a4aa3f04bd617f7a721b6e2e5aac7',
      },
      {
        id: expect.any(String),
        address:
          'k:cbc0df2219a816f2874d206987e34a206997b206ed62878ba902c3e3e5cb1bd9',
        index: 1,
        name: 'Kadena Renamed 2',
        publicKey:
          '0x00cbc0df2219a816f2874d206987e34a206997b206ed62878ba902c3e3e5cb1bd9',
      },
    ]);
  });

  it('throws an error if the account does not exist', async () => {
    const { request } = await installSnap();

    const response = await request({
      method: 'kda_setAccountName',
      params: {
        id: 'invalid',
        name: 'Kadena Renamed 2',
      },
    });

    expect(response).toRespondWithError({
      code: 4001,
      message: 'Account does not exist',
      stack: expect.any(String),
    });
  });
});
