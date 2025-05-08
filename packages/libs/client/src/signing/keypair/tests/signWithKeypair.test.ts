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
        sig: '6d4db9f196afaa8dfb056aee782a5d74edc6fcd91d0eab06883007bf267d63f3c2b0f4bc91e1e3c50d434148eabfb21201c63fcccdfb44da086b347a35fa530e',
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
        sig: '6d4db9f196afaa8dfb056aee782a5d74edc6fcd91d0eab06883007bf267d63f3c2b0f4bc91e1e3c50d434148eabfb21201c63fcccdfb44da086b347a35fa530e',
      },
      {
        pubKey:
          '815224b7316e0053635a91fea90f1f5bb474831b257be1aaaf2129ff989824d8',
        sig: '3f554a1d62a81e67e3bc6d6779ab62b1e4d8dbe6bcd0e611985065a9d124653012eb37e085ddfb3505cd704ea2666bf3404eadee2d915308543583e7581d7d0d',
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
        sig: '3725906aaa22b8fa6651c591343e3463539d9e64f774390aff0332f8bcbe7b2315bef57ef4d9b65a2893faebee33890ddaadb6bdf69d176e51be07e4c112200a',
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
        sig: '6d4db9f196afaa8dfb056aee782a5d74edc6fcd91d0eab06883007bf267d63f3c2b0f4bc91e1e3c50d434148eabfb21201c63fcccdfb44da086b347a35fa530e',
      },
      {
        pubKey:
          '815224b7316e0053635a91fea90f1f5bb474831b257be1aaaf2129ff989824d8',
        sig: '3f554a1d62a81e67e3bc6d6779ab62b1e4d8dbe6bcd0e611985065a9d124653012eb37e085ddfb3505cd704ea2666bf3404eadee2d915308543583e7581d7d0d',
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
        pubKey:
          '815224b7316e0053635a91fea90f1f5bb474831b257be1aaaf2129ff989824d8',
        sig: '7a71acbd6031af32a9ac3310307c094862cebc495b0444fd812b88e5a81511fb3ec7b43dcac84cf976fe5868342e3c858e236913b86ac483bff36e79c02dff0b',
      },
    ]);

    expect(signedTx2.sigs).toEqual([
      {
        sig: '3725906aaa22b8fa6651c591343e3463539d9e64f774390aff0332f8bcbe7b2315bef57ef4d9b65a2893faebee33890ddaadb6bdf69d176e51be07e4c112200a',
        pubKey:
          '09e82da78d531e2d16852a923e9fe0f80f3b67a9b8d92c7f05e4782222252e12',
      },
    ]);
  });
});
