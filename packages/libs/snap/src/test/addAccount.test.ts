import { installSnap } from '@metamask/snaps-jest';

describe('kda_addAccount', () => {
  it('should derive a new account and store it correctly', async () => {
    const { request } = await installSnap();

    let response = await request({
      method: 'kda_addAccount',
    });

    expect(response).toRespondWith({
      id: expect.any(String),
      index: 1,
      address:
        'k:cbc0df2219a816f2874d206987e34a206997b206ed62878ba902c3e3e5cb1bd9',
      name: 'Kadena Account 2',
      publicKey:
        '0x00cbc0df2219a816f2874d206987e34a206997b206ed62878ba902c3e3e5cb1bd9',
    });

    response = await request({
      method: 'kda_addAccount',
    });

    expect(response).toRespondWith({
      id: expect.any(String),
      index: 2,
      address:
        'k:bec68387d260206cfc41eba0d8ed3ce429d0ff1722a4b2cea56d7e5de9cb2bcc',
      name: 'Kadena Account 3',
      publicKey:
        '0x00bec68387d260206cfc41eba0d8ed3ce429d0ff1722a4b2cea56d7e5de9cb2bcc',
    });

    const accounts = await request({
      method: 'kda_getAccounts',
    });

    expect(accounts).toRespondWith([
      {
        id: expect.any(String),
        index: 0,
        address:
          'k:62bb7cf156ccfbe17bd6ca5460098ca9398a4aa3f04bd617f7a721b6e2e5aac7',
        name: 'Kadena Account 1',
        publicKey:
          '0x0062bb7cf156ccfbe17bd6ca5460098ca9398a4aa3f04bd617f7a721b6e2e5aac7',
      },
      {
        id: expect.any(String),
        index: 1,
        address:
          'k:cbc0df2219a816f2874d206987e34a206997b206ed62878ba902c3e3e5cb1bd9',
        name: 'Kadena Account 2',
        publicKey:
          '0x00cbc0df2219a816f2874d206987e34a206997b206ed62878ba902c3e3e5cb1bd9',
      },
      {
        id: expect.any(String),
        index: 2,
        address:
          'k:bec68387d260206cfc41eba0d8ed3ce429d0ff1722a4b2cea56d7e5de9cb2bcc',
        name: 'Kadena Account 3',
        publicKey:
          '0x00bec68387d260206cfc41eba0d8ed3ce429d0ff1722a4b2cea56d7e5de9cb2bcc',
      },
    ]);
  });
});
