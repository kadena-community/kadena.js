import type { ICommand } from '@kadena/client';
import { Pact, createClient } from '@kadena/client';
import { createRequestToSign } from './util/requestToSign';

const signTransaction = createRequestToSign();

async function deployContract(
  deployerAccount: string,
  pubKey: string,
  contractCode: string,
) {
  const pactClient = createClient();

  const tx = Pact.builder
    .execution(contractCode)
    .addSigner(pubKey, (signFor) => [signFor('coin.GAS')])
    .setMeta({
      chainId: '1',
      gasLimit: 80300,
      gasPrice: 0.0000001,
      senderAccount: deployerAccount,
    })
    .setNetworkId('testnet04')
    .createTransaction();

  try {
    const signedTx = (await signTransaction(tx)) as ICommand; // Pick your preferred signing method
    const preflightResult = await pactClient.preflight(signedTx);
    console.log('Preflight result:', preflightResult);

    if (preflightResult.result.status === 'failure') {
      console.error('Preflight failed:', preflightResult.result.error);
      return preflightResult;
    }

    const res = await pactClient.submit(signedTx);
    console.log('Deploy request sent', res);
    const result = await pactClient.pollOne(res);
    if (result.result.status === 'failure') {
      console.error('Deploy failed:', result.result.error);
    }
    return result;
  } catch (error) {
    console.error('Error deploying contract:', error);
  }
}
const deployerKDAAccount =
  'k:94eede9754031395401332c2032694da9dd2f7972fb039070f698a3173745a8b';
const deployerPublicKey =
  '94eede9754031395401332c2032694da9dd2f7972fb039070f698a3173745a8b';
deployContract(
  deployerKDAAccount,
  deployerPublicKey,
  `
  (namespace 'free)
  (module simplemodule GOV
    (defcap GOV () true)
    (defconst TEXT:string "Hello World")
    (defun greet:string () TEXT)
  )`,
)
  .then((result) => {
    console.log('Contract deployed:', result);
  })
  .catch(console.error);
