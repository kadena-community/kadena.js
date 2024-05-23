import { Pact, addSignatures, createClient } from '@kadena/client';
import {
  kadenaGenKeypair,
  kadenaMnemonicToRootKeypair,
  kadenaSign as legacyKadenaSign,
} from '@kadena/hd-wallet/chainweaver';
import { describe, expect, it } from 'vitest';

const publicKey =
  'ff9b64a61902024870a59775624ca594ab14054c97eb6fae97105b88674b5edd';
const mnemonic =
  'purse risk disorder usual coral enforce blind march wink plate antenna start';
const password = '123123123';

const target =
  'k:3f13aa07c9682fd78e0cf9d766ed5f5563b984a9a33f94e288c8a3ee4f454916';
const amount = 0.01;

describe('template to legacy live test', () => {
  // skipped because usage of live chainweb-api (only used for manual testing)
  it.skip('creates, signs and tests the transaction', async () => {
    const rootkey = await kadenaMnemonicToRootKeypair(password, mnemonic);
    const keypair = await kadenaGenKeypair(password, rootkey, 0);

    expect(keypair.publicKey).toEqual(publicKey);

    const transaction = Pact.builder
      .execution(`(coin.transfer "k:${publicKey}" "${target}" ${amount})`)
      .addSigner(publicKey, (withCap) => [
        withCap('coin.TRANSFER', `k:${publicKey}`, `${target}`, amount),
        withCap('coin.GAS'),
      ])
      .setMeta({
        chainId: '0',
        senderAccount: `k:${publicKey}`,
      })
      .setNetworkId('testnet04')
      .createTransaction();

    const sigUint8Array = await legacyKadenaSign(
      password,
      transaction.hash,
      keypair.secretKey,
    );

    const sig = Buffer.from(sigUint8Array).toString('hex');

    const signed = addSignatures(transaction, { sig, pubKey: publicKey });

    const networkHost = 'https://api.testnet.chainweb.com';
    const client = createClient(
      ({ networkId, chainId }) =>
        `${networkHost}/chainweb/0.0/${networkId}/chain/${chainId}/pact`,
    );

    const result = await client.local(signed, {
      preflight: false,
      signatureVerification: true,
    });
    expect(result.result.status).toBe('success');
  });
});
