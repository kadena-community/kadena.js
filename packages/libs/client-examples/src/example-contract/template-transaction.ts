import type { ICommand } from '@kadena/client';
import {
  createClient,
  isSignedTransaction,
  Pact,
  signWithChainweaver,
} from '@kadena/client';

interface IAccount {
  // In KDA, the account name is not the same as the public key. The reason is that the account could be multi-signature, and you can choose a user-friendly name for yourself.
  accountName: string;
  // We need this for signing the transaction.
  publicKey: string;
}

// The reason you need to call createClient for accessing helpers like submit, listen, and etc is
// We don't want to force everybody to send transactions to kadena.io nodes. and let the developer decide
// about the node they want to send the Tx
// you can configure createClient with a hostUrlGenerator function that returns the base url
// based on networkId, chainId. otherwise it uses kadena.io urls.
// in a real application you can configure this once in a module and then export the helpers you need
const { submit, listen } = createClient();

async function transfer(
  sender: IAccount,
  receiver: IAccount,
  amount: string,
): Promise<void> {
  // The first step for interacting with the blockchain is creating a request object.
  // We call this object a transaction object. `Pact.builder` helps you to create this object easily.
  const transaction = Pact.builder
    // There are two types of commands in pact: execution and continuation. Most of the typical use cases only use execution.
    .execution(
      // This function uses the type definition we generated in the previous step and returns the pact code as a string.
      // The following code means you want to call the transfer function of the coin module (contract).
      // You can open the coin.d.ts file and see all of the available functions.
      Pact.modules.coin.transfer(
        sender.accountName,
        receiver.accountName,
        // As we know JS rounds float numbers, which is not a desirable behavior when you are working with money.
        // So instead, we send the amount as a string in this format.
        // alternatively you can use PactNumber class from "@kadena/pactjs" that creates the same object
        {
          decimal: amount,
        },
      ),
    )
    // The sender needs to sign the command; otherwise, the blockchain node will refuse to do the transaction.
    // there is the concept of capabilities in Pact, we will explain it in the more in-depth part.
    // if you are using TypeScript this function comes with types of the available capabilities based on the execution part.
    .addSigner(sender.publicKey, (signFor) => [
      // The sender scopes their signature only to "coin.TRANSFER" and "coin.GAS" with the specific arguments.
      // The sender mentions they want to pay the gas fee by adding the "coin.GAS" capability.
      signFor('coin.GAS'),
      // coin.TRANSFER capability has some arguments that lets users mention the sender, receiver and the maximum
      // amount they want to transfer
      signFor('coin.TRANSFER', sender.accountName, receiver.accountName, {
        decimal: amount,
      }),
    ])
    // Since Kadena has a multi-chain architecture, we need to set the chainId.
    // We also need to mention who is going to pay the gas fee.
    .setMeta({ chainId: '0', senderAccount: sender.accountName })
    // We set the networkId to "testnet04"; this could also be "mainnet01" or something else if you use a private network or a fork.
    .setNetworkId('testnet04')
    // Finalize the command and add default values and hash to it. After this step, no one can change the command.
    .createTransaction();

  // The transaction now has three properties:
  // - cmd: stringified version of the command
  // - hash: the hash of the cmd field
  // - sigs: an array that has the same length as signers in the command but all filled by undefined

  // Now you need to sign the transaction; you can do it in a way that suits you.
  // We exported some helpers like `signWithChainweaver` and `signWithWalletConnect`, but you can also use other wallets.
  // By the end, the signer function should fill the sigs array and return the signed transaction.
  const { sigs } = (await signWithChainweaver(transaction)) as ICommand;
  // signWithChainweaver already returns a signedTx and its completely safe to use it, but I rather extracted the sigs part and regenerated the signedTx again, its double security, if you are using a wallet that are not completely sure about it's implementation, its better to do tha same technique.
  const signedTx: ICommand = { ...transaction, sigs };

  // As the signer function could be an external function, we double-check if the transaction is signed correctly.
  if (!isSignedTransaction(signedTx)) {
    throw new Error('TX_IS_NOT_SIGNED');
  }

  // Now it's time to submit the transaction; this function returns the requestDescriptor {requestKey, networkId, chainId}.
  // by storing this object in a permanent storage you always can fetch the result of the transaction from the blockchain
  const requestDescriptor = await submit(signedTx);
  // We listen for the result of the request.
  const response = await listen(requestDescriptor);
  // Now we need to check the status.
  if (response.result.status === 'failure') {
    throw response.result.error;
  }

  // Congratulations! You have successfully submitted a transfer transaction.
  console.log(response.result);
}

// Calling the function with proper input
transfer(
  { accountName: 'bob', publicKey: 'bob_public_key' },
  { accountName: 'alice', publicKey: 'alice_public_key' },
  '1',
).catch(console.error);
