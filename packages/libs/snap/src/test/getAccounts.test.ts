import { installSnap } from '@metamask/snaps-jest';

describe('kda_getAccounts', () => {
  it('returns the accounts already stored on the snap', async () => {
    const { request } = await installSnap();

    // Get initial account
    let response = await request({
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
    ]);

    // Derive account 2
    await request({
      method: 'kda_addAccount',
    });

    // Get all accounts
    response = await request({
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
  });
});
