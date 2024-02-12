import {
  createClient,
  isSignedTransaction,
  Pact,
  readKeyset,
} from '@kadena/client';
import { genKeyPair, sign } from '@kadena/cryptography-utils';
import { PactNumber } from '@kadena/pactjs';


const FAUCET_ACCOUNT =  'c:Ecwy85aCW3eogZUnIQxknH8tG8uXHM5QiC__jeI0nWA';

const NAMESPACE =  'n_d8cbb935f9cd9d2399a5886bb08caed71f9bad49';

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
  const keyPair = genKeyPair();
  const KEYSET_NAME = 'new_keyset';

  const account = 'k:bbd29528936ebe93264d0763916238db8b63b56d4ddfdad0c9f809ad047f8eea';
  const amount = 20;
  const chainId = '0';
  const pred = 'keys-all';
  const keys = [
    'bbd29528936ebe93264d0763916238db8b63b56d4ddfdad0c9f809ad047f8eea'
  ];

  const networkDto = {
    API: 'https://api.testnet.chainweb.com',
    networkId: 'testnet04',
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
