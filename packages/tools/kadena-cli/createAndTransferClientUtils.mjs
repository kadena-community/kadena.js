import { createSignWithKeypair } from '@kadena/client';
import { transferCreate } from '@kadena/client-utils/coin';
import { genKeyPair } from '@kadena/cryptography-utils';

const FAUCET_ACCOUNT =  'c:Ecwy85aCW3eogZUnIQxknH8tG8uXHM5QiC__jeI0nWA';

export async function createAndTransferFund() {
  const keyPair = genKeyPair();
  const gasPayerAccount = {
    accountName: FAUCET_ACCOUNT,
    publicKey: FAUCET_ACCOUNT,
  };

  const senderAccount = {
    accountName: FAUCET_ACCOUNT,
    publicKey: FAUCET_ACCOUNT,
  };

  const receiverAccount = {
    name: 'w:5TxGJNtrbVp1zdQhYnQD8MWyBpATVk1Nq0vjTzfCJmE:keys-all',
    predicate: 'keys-all',
    publicKeys: [
      'fd84545c9e056af96a7d1af00f495108668120945a97fd7aed29caa538e2c039',
      '09ab52dfa37b9a0076cbcd4114e1e20975f23bead3471fae23b0ee8414ea782d',
      '4b9f38ae3a192b2ae38cd0b48134dc5a75b87479d1b48bdc0228b50ef7c1e6dd'
    ],
  };

  const config = {
    chainId: '0',
    amount: 20,
    contract: 'coin-faucet',
    networkConfig: {
      networkHost: 'https://api.testnet.chainweb.com',
      networkId: 'testnet04',
    },
  };
  const { chainId, amount, contract, networkConfig } =
    config;

  try {
    const result = await transferCreate(
      {
        sender: {
          account: senderAccount.accountName,
          publicKeys: [keyPair.publicKey],
        },
        receiver: {
          account: receiverAccount.name,
          keyset: {
            pred: receiverAccount.predicate,
            keys: receiverAccount.publicKeys,
          },
        },
        gasPayer: {
          account: gasPayerAccount.accountName,
          publicKeys: [gasPayerAccount.publicKey],
        },
        chainId: chainId,
        amount: amount,
        contract: contract,
      },
      {
        host: networkConfig.networkHost,
        defaults: {
          networkId: networkConfig.networkId,
          meta: {
            chainId: chainId,
          },
        },
        sign: createSignWithKeypair({
          publicKey: keyPair.publicKey,
          secretKey: keyPair.secretKey,
        }),
      },
    )
    .on('sign', (data) => console.log({ sign: data}))
    .on('submit', (data) => console.log({ submit: data}))
    .on('listen', (data) => console.log({ listen: data}))
    .execute();

    return result;
  } catch (error) {
    throw new Error(`Failed to create account and transfer fund: ${error}`);
  }
}

createAndTransferFund()
  .then((result) => console.log({ result }))
  .catch((error) => console.error({ error }));
