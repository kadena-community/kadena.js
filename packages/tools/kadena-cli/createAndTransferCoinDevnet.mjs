import {
  createClient,
  isSignedTransaction,
  Pact,
  readKeyset,
} from '@kadena/client';
import { genKeyPair, sign } from '@kadena/cryptography-utils';
import { PactNumber } from '@kadena/pactjs';


const FAUCET_ACCOUNT =  'c:zWPXcVXoHwkNTzKhMU02u2tzN_yL6V3-XTEH1uJaVY4';

const NAMESPACE =  'n_34d947e2627143159ea73cdf277138fd571f17ac';

const CONTRACT_NAME =  'coin-faucet';

export const getApiHost = ({
  api,
  networkId,
  chainId,
}) => {
  let scheme = '';
  if (!api.startsWith('http')) {
    scheme = 'https://';
  }
  if (api.includes('localhost')) {
    scheme = 'http://';
  }
  return `${scheme}${api}/chainweb/0.0/${networkId}/chain/${chainId}/pact`;
};

async function main() {
  const keyPair = {
    publicKey: '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
    secretKey: '251a920c403ae8c8f65f59142316af3c82b631fba46ddea92ee8c95035bd2898',
  };
  const KEYSET_NAME = 'new_keyset';

  const account = 'w:5TxGJNtrbVp1zdQhYnQD8MWyBpATVk1Nq0vjTzfCJmE:keys-all';
  const amount = 20;
  const chainId = '0';
  const pred = 'keys-all';
  const keys = [
    'fd84545c9e056af96a7d1af00f495108668120945a97fd7aed29caa538e2c039',
    '09ab52dfa37b9a0076cbcd4114e1e20975f23bead3471fae23b0ee8414ea782d',
    '4b9f38ae3a192b2ae38cd0b48134dc5a75b87479d1b48bdc0228b50ef7c1e6dd'
  ];

  const networkDto = {
    API: 'localhost:8080',
    networkId: 'fast-development',
  };

  const transaction = Pact.builder
    .execution(
      Pact.modules[
        `${NAMESPACE}.${CONTRACT_NAME}`
      ]['create-and-request-coin'](
        account,
        readKeyset(KEYSET_NAME),
        new PactNumber(amount).toPactDecimal(),
      ),
    )
    .addSigner(keyPair.publicKey, (withCapability) => [
      withCapability(
        `${NAMESPACE}.${CONTRACT_NAME}.GAS_PAYER`,
        account,
        { int: 1 },
        { decimal: '1.0' },
      ),
      withCapability(
        'coin.TRANSFER',
        FAUCET_ACCOUNT,
        account,
        new PactNumber(amount).toPactDecimal(),
      ),
    ])
    .addKeyset(KEYSET_NAME, pred, ...keys)
    .setMeta({ senderAccount: FAUCET_ACCOUNT, chainId })
    .setNetworkId(networkDto.networkId)
    .createTransaction();

  console.log({
    transaction: transaction.cmd,
  });

  const signature = sign(transaction.cmd, keyPair);

  if (signature.sig === undefined) {
    throw new Error('Failed to sign transaction');
  }

  const apiHost = getApiHost({
    api: networkDto.API,
    networkId: networkDto.networkId,
    chainId,
  });

  transaction.sigs = [{ sig: signature.sig }];

  const { submit, listen } = createClient(apiHost);

  if (!isSignedTransaction(transaction)) {
    throw new Error('Transaction is not signed');
  }

  const requestKeys = await submit(transaction);
  console.log({
    requestKeys,
  });
  const response = await listen(requestKeys);
  return response;
}

main()
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });
