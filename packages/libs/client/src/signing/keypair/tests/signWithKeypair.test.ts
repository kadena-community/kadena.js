import type { IKeyPair } from '@kadena/types';
import { beforeAll, describe, expect, it } from 'vitest';
import type { ICoin } from '../../../composePactCommand/test/coin-contract';
import type { ISignFunction } from '../../../index';
import { Pact } from '../../../index';
import { getModule } from '../../../pact';
import { createSignWithKeypair } from '../createSignWithKeypair';

const keyPair: IKeyPair = {
  publicKey: '09e82da78d531e2d16852a923e9fe0f80f3b67a9b8d92c7f05e4782222252e12',
  secretKey: '76e1cabaa58a33321982e434f355dc7a4cfbee092a4ac1c7aac26302ba80d992',
};

const coin: ICoin = getModule('coin');

describe('createSignWithKeypair', () => {
  let signWithKeypair: ISignFunction;
  beforeAll(() => {
    signWithKeypair = createSignWithKeypair(keyPair) as ISignFunction;
  });

  it('returns a function to sign with', async () => {
    expect(typeof signWithKeypair).toBe('function');
  });
});

describe('signWithKeypair', () => {
  let signWithKeypair: ISignFunction;
  beforeAll(() => {
    signWithKeypair = createSignWithKeypair(keyPair);
  });

  it('throws an error when nothing is to be signed', async () => {
    try {
      await (signWithKeypair as unknown as () => {})();
    } catch (e) {
      expect(e.message).toContain('No transaction(s) to sign');
    }
  });

  it('throws when an error is returned', async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (createSignWithKeypair as any)(undefined);
    } catch (e) {
      expect(e).toBeTruthy();
    }
  });

  it('adds signatures in multisig fashion to the transactions', async () => {
    const keyPair2: IKeyPair = {
      publicKey:
        '815224b7316e0053635a91fea90f1f5bb474831b257be1aaaf2129ff989824d8',
      secretKey:
        '63568bda80b8ff430a5816b0292b456362c8d426ddda08a249e0cb9c005d2502',
    };
    const signWithKeypair2 = createSignWithKeypair(keyPair2);

    const unsignedTransaction = Pact.builder
      .execution(coin.transfer('k:from', 'k:to', { decimal: '1.0' }))
      .addSigner(keyPair.publicKey, (withCap) => [withCap('coin.GAS')])
      .addSigner(keyPair2.publicKey, (withCap) => [
        withCap('coin.TRANSFER', 'k:from', 'k:to', { decimal: '1.234' }),
      ])
      .setMeta({
        senderAccount: '',
        chainId: '0',
        creationTime: 0,
      })
      .setNonce('my-nonce')
      .createTransaction();

    const txWithOneSig = await signWithKeypair(unsignedTransaction);

    expect(txWithOneSig.sigs).toStrictEqual([
      {
        pubKey:
          '09e82da78d531e2d16852a923e9fe0f80f3b67a9b8d92c7f05e4782222252e12',
        sig: '5bdcceab829c628afc2afe28d18e5efdc724f0ebc18e1aa10b03c07123f23bdd698a197aba39fc035c0a71c5c821f2f8e12fd6fb138dc33e6d2323b3bbd1b40e',
      },
      {
        pubKey:
          '815224b7316e0053635a91fea90f1f5bb474831b257be1aaaf2129ff989824d8',
      },
    ]);

    const signedTx = await signWithKeypair2(txWithOneSig);
    expect(signedTx.sigs).toEqual([
      {
        pubKey:
          '09e82da78d531e2d16852a923e9fe0f80f3b67a9b8d92c7f05e4782222252e12',
        sig: '5bdcceab829c628afc2afe28d18e5efdc724f0ebc18e1aa10b03c07123f23bdd698a197aba39fc035c0a71c5c821f2f8e12fd6fb138dc33e6d2323b3bbd1b40e',
      },
      {
        pubKey:
          '815224b7316e0053635a91fea90f1f5bb474831b257be1aaaf2129ff989824d8',
        sig: 'b921a16a15e2ffa36bda28fb1dcb98ef75e83d94ac2f2736013981d73759ead51945b1df21de254429772cdd6bfe8ea3c63001dfd06a2e0b0322abd3de2c7600',
      },
    ]);
  });

  it('tries to sign with the wrong keypair', async () => {
    const keyPair2: IKeyPair = {
      publicKey:
        '815224b7316e0053635a91fea90f1f5bb474831b257be1aaaf2129ff989824d8',
      secretKey:
        '63568bda80b8ff430a5816b0292b456362c8d426ddda08a249e0cb9c005d2502',
    };
    const signWithKeypair2 = createSignWithKeypair(keyPair2);

    const unsignedTransaction = Pact.builder
      .execution(coin.transfer('k:from', 'k:to', { decimal: '1.0' }))
      .addSigner(keyPair.publicKey, (withCap) => [withCap('coin.GAS')])
      .createTransaction();

    try {
      await signWithKeypair2(unsignedTransaction);
    } catch (error) {
      expect(error.message).toContain(
        'The keypair(s) provided are not relevant to the transaction',
      );
      return;
    }
    // should not end up here
    expect(true).toBe(false);
  });

  it('signs with two keypairs when one is required', async () => {
    const keyPair2: IKeyPair = {
      publicKey:
        '815224b7316e0053635a91fea90f1f5bb474831b257be1aaaf2129ff989824d8',
      secretKey:
        '63568bda80b8ff430a5816b0292b456362c8d426ddda08a249e0cb9c005d2502',
    };

    const unsignedTransaction = Pact.builder
      .execution(coin.transfer('k:from', 'k:to', { decimal: '1.0' }))
      .addSigner(keyPair.publicKey, (withCap) => [withCap('coin.GAS')])
      .setMeta({
        senderAccount: '',
        chainId: '0',
        creationTime: 0,
      })
      .setNonce('my-nonce')
      .createTransaction();

    const signWithKeystore = createSignWithKeypair([keyPair, keyPair2]);
    const signedTx = await signWithKeystore(unsignedTransaction);

    expect(signedTx.sigs).toEqual([
      {
        pubKey:
          '09e82da78d531e2d16852a923e9fe0f80f3b67a9b8d92c7f05e4782222252e12',
        sig: 'fbc3819d977cf8f770c5fc6b5a75a3099969a7945cec6a5d2bd1e7dd0130a68935d52f1cfce62046db885370511904e00a9a9d2fee84f653f5d324dce9a82a00',
      },
    ]);
  });

  it('signs with two keypairs', async () => {
    const keyPair2: IKeyPair = {
      publicKey:
        '815224b7316e0053635a91fea90f1f5bb474831b257be1aaaf2129ff989824d8',
      secretKey:
        '63568bda80b8ff430a5816b0292b456362c8d426ddda08a249e0cb9c005d2502',
    };

    const unsignedTransaction = Pact.builder
      .execution(coin.transfer('k:from', 'k:to', { decimal: '1.0' }))
      .addSigner(keyPair.publicKey, (withCap) => [withCap('coin.GAS')])
      .addSigner(keyPair2.publicKey, (withCap) => [
        withCap('coin.TRANSFER', 'k:from', 'k:to', { decimal: '1.234' }),
      ])
      .setMeta({
        senderAccount: '',
        chainId: '0',
        creationTime: 0,
      })
      .setNonce('my-nonce')
      .createTransaction();

    const signWithKeystore = createSignWithKeypair([keyPair, keyPair2]);
    const signedTx = await signWithKeystore(unsignedTransaction);

    expect(signedTx.sigs).toEqual([
      {
        pubKey:
          '09e82da78d531e2d16852a923e9fe0f80f3b67a9b8d92c7f05e4782222252e12',
        sig: '5bdcceab829c628afc2afe28d18e5efdc724f0ebc18e1aa10b03c07123f23bdd698a197aba39fc035c0a71c5c821f2f8e12fd6fb138dc33e6d2323b3bbd1b40e',
      },
      {
        pubKey:
          '815224b7316e0053635a91fea90f1f5bb474831b257be1aaaf2129ff989824d8',
        sig: 'b921a16a15e2ffa36bda28fb1dcb98ef75e83d94ac2f2736013981d73759ead51945b1df21de254429772cdd6bfe8ea3c63001dfd06a2e0b0322abd3de2c7600',
      },
    ]);
  });

  it('signs multiple transactions with multiple keys passed to `createSignWithKeypair`', async () => {
    const keyPair2: IKeyPair = {
      publicKey:
        '815224b7316e0053635a91fea90f1f5bb474831b257be1aaaf2129ff989824d8',
      secretKey:
        '63568bda80b8ff430a5816b0292b456362c8d426ddda08a249e0cb9c005d2502',
    };

    const tx1 = Pact.builder
      .execution(coin.transfer('k:from', 'k:to', { decimal: '1.0' }))
      .setMeta({
        senderAccount: '',
        chainId: '0',
        creationTime: 0,
      })
      .setNonce('my-nonce')
      .addSigner(keyPair2.publicKey, (withCap) => [
        withCap('coin.TRANSFER', 'k:from', 'k:to', { decimal: '1.234' }),
      ])
      .createTransaction();

    const tx2 = Pact.builder
      .execution(coin.transfer('k:from', 'k:to', { decimal: '1.0' }))
      .setMeta({
        senderAccount: '',
        chainId: '0',
        creationTime: 0,
      })
      .setNonce('my-nonce')
      .addSigner(keyPair.publicKey, (withCap) => [withCap('coin.GAS')])
      .createTransaction();

    const signWithKeystore = createSignWithKeypair([keyPair, keyPair2]);
    const [signedTx1, signedTx2] = await signWithKeystore([tx1, tx2]);

    expect(signedTx1.sigs).toEqual([
      {
        sig: '522264b48dfefacd06ac6edc4b72e37629f946dbb464396b069b035d7c11e0b4852ea0c9ef4da8aeafb964ed348c1d0a416d9736af87e8d936bbb2c1bc7d5c0e',
        pubKey:
          '815224b7316e0053635a91fea90f1f5bb474831b257be1aaaf2129ff989824d8',
      },
    ]);

    expect(signedTx2.sigs).toEqual([
      {
        sig: 'fbc3819d977cf8f770c5fc6b5a75a3099969a7945cec6a5d2bd1e7dd0130a68935d52f1cfce62046db885370511904e00a9a9d2fee84f653f5d324dce9a82a00',
        pubKey:
          '09e82da78d531e2d16852a923e9fe0f80f3b67a9b8d92c7f05e4782222252e12',
      },
    ]);
  });
});
