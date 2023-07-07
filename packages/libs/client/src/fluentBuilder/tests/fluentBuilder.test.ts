import { ICoin } from '../../commandBuilder/test/coin-contract';
import { getModule } from '../../pact';
import { createFluentBuilder } from '../fluentBuilder';

jest.useFakeTimers().setSystemTime(new Date('2023-07-27'));

const coin: ICoin = getModule('coin');

describe('fluentBuilder', () => {
  it('returns exec payload', () => {
    const builder = createFluentBuilder();
    const command = builder
      .execute(coin.transfer('bob', 'alice', { decimal: '12' }))
      .getCommand();

    expect(command).toStrictEqual({
      payload: {
        exec: { code: '(coin.transfer "bob" "alice" 12.0)', data: {} },
      },
      signers: [],
      nonce: 'kjs:nonce:1690416000000',
    });
  });

  it('returns cont payload', () => {
    const builder = createFluentBuilder();
    const command = builder
      .continuation({
        pactId: '1',
        proof: 'proof',
      })
      .getCommand();

    expect(command).toStrictEqual({
      payload: { cont: { pactId: '1', proof: 'proof' } },
      signers: [],
      nonce: 'kjs:nonce:1690416000000',
    });
  });

  it('returns command with signers', () => {
    const builder = createFluentBuilder();
    const command = builder
      .execute(coin.transfer('bob', 'alice', { decimal: '12' }))
      .addSigner('bob_pubkey', (withCapability) => [
        withCapability('coin.GAS'),
        withCapability('coin.TRANSFER', 'bob', 'alice', { decimal: '12' }),
      ])
      .getCommand();

    expect(command).toStrictEqual({
      payload: {
        exec: { code: '(coin.transfer "bob" "alice" 12.0)', data: {} },
      },
      signers: [
        {
          clist: [
            { args: [], name: 'coin.GAS' },
            {
              args: ['bob', 'alice', { decimal: '12' }],
              name: 'coin.TRANSFER',
            },
          ],
          pubKey: 'bob_pubkey',
          scheme: 'ED25519',
        },
      ],
      nonce: 'kjs:nonce:1690416000000',
    });
  });

  it('returns command with meta', () => {
    const builder = createFluentBuilder();
    const command = builder
      .execute(coin.transfer('bob', 'alice', { decimal: '12' }))
      .setMeta({ chainId: '0' })
      .getCommand();

    expect(command).toStrictEqual({
      payload: {
        exec: { code: '(coin.transfer "bob" "alice" 12.0)', data: {} },
      },
      signers: [],
      meta: {
        chainId: '0',
        creationTime: 1690416000,
        gasLimit: 2500,
        gasPrice: 1e-8,
        sender: '',
        ttl: 28800,
      },
      nonce: 'kjs:nonce:1690416000000',
    });
  });
  it('returns command with custom nonce', () => {
    const builder = createFluentBuilder();
    const command = builder
      .execute(coin.transfer('bob', 'alice', { decimal: '12' }))
      .setNonce('test-nonce')
      .getCommand();

    expect(command).toStrictEqual({
      payload: {
        exec: { code: '(coin.transfer "bob" "alice" 12.0)', data: {} },
      },
      signers: [],
      nonce: 'test-nonce',
    });
  });

  it('returns command with custom nonce by using nonce generator', () => {
    const builder = createFluentBuilder();
    const command = builder
      .execute(coin.transfer('bob', 'alice', { decimal: '12' }))
      .setNonce((cmd) => `test-nonce:${Object.keys(cmd).length}`)
      .getCommand();

    expect(command).toStrictEqual({
      payload: {
        exec: { code: '(coin.transfer "bob" "alice" 12.0)', data: {} },
      },
      signers: [],
      nonce: 'test-nonce:1',
    });
  });

  it('returns command with network', () => {
    const builder = createFluentBuilder();
    const command = builder
      .execute(coin.transfer('bob', 'alice', { decimal: '12' }))
      .setNetworkId('mainnet01')
      .getCommand();

    expect(command).toStrictEqual({
      payload: {
        exec: { code: '(coin.transfer "bob" "alice" 12.0)', data: {} },
      },
      signers: [],
      networkId: 'mainnet01',
      nonce: 'kjs:nonce:1690416000000',
    });
  });

  it('returns unsigned transaction', () => {
    const builder = createFluentBuilder();
    const unSignedTr = builder
      .execute(coin.transfer('bob', 'alice', { decimal: '12' }))
      .addSigner('bob_bup_key')
      .setNetworkId('mainnet01')
      .createTransaction();

    expect(unSignedTr).toStrictEqual({
      cmd: '{"payload":{"exec":{"code":"(coin.transfer \\"bob\\" \\"alice\\" 12.0)","data":{}}},"nonce":"kjs:nonce:1690416000000","networkId":"mainnet01","signers":[{"pubKey":"bob_bup_key","scheme":"ED25519"}]}',
      hash: 'OPcc4TsVRXTV_EtpbivnSBu71Znegy50-S3if5QADVY',
      sigs: [undefined],
    });
  });
});
