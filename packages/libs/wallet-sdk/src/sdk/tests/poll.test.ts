import { assert, describe, test } from 'vitest';

import type { ChainId } from '@kadena/client';
import { addSignatures, isSignedTransaction } from '@kadena/client';
import {
  kadenaGenKeypairFromSeed,
  kadenaMnemonicToSeed,
  kadenaSignWithSeed,
} from '@kadena/hd-wallet';
import { walletSdk } from '../walletSdk.js';

describe('example test', () => {
  test(
    'example',
    async () => {
      const mnemonic =
        'replace piano limit frozen provide system layer holiday spring nation hire verify';
      const password = '12345678';
      const seed = await kadenaMnemonicToSeed(password, mnemonic);
      const [publicKey] = await kadenaGenKeypairFromSeed(password, seed, 0);
      console.log('PublicKey:', publicKey);
      const [publicKey2] = await kadenaGenKeypairFromSeed(password, seed, 1);

      walletSdk.logger.setTransport(console.log);

      const chainId = '0' as ChainId;
      const networkId = 'testnet04';
      const command = walletSdk.createTransferCreateCommand({
        amount: '0.01',
        sender: `k:${publicKey}`,
        receiver: {
          account: `k:${publicKey2}`,
          keyset: {
            keys: [publicKey2],
            pred: 'keys-all',
          },
        },
        chainId,
        networkId,
      });

      const signed = await kadenaSignWithSeed(password, seed, 0)(command.hash);
      const signedCommand = addSignatures(command, signed);

      if (!isSignedTransaction(signedCommand)) throw new Error('Not signed');

      assert(true);

      console.log('hash', signedCommand.hash);

      // console.log('submit transaction', signedCommand);
      // const transactionDescriptor = await walletSdk.sendTransaction(
      //   signedCommand,
      //   networkId,
      //   chainId,
      // );

      const transactionDescriptor = {
        requestKey: 'ttXp7xHw5ETUccS0MM4IRhVVb9F5tkTWDXaO2FNHsio',
        chainId: '0' as ChainId,
        networkId: 'testnet04',
      };

      console.log(transactionDescriptor);

      const result = await walletSdk.waitForPendingTransaction(
        transactionDescriptor,
      );
      console.log(result);

      await new Promise((resolve) => {
        walletSdk.subscribePendingTransactions(
          [transactionDescriptor],
          (transaction, result) => {
            console.log('callback', transaction, result);
            resolve(result);
          },
        );
      });

      // console.log(transactionDescriptor);
      // const result = await walletSdk.waitForPendingTransaction(
      //   transactionDescriptor,
      // );
      // expect(result.status).toEqual('success');
    },
    { timeout: 60000 },
  );
});
