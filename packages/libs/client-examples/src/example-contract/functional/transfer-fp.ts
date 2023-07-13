import {
  createTransaction,
  getClient,
  ICommand,
  Pact,
  signWithChainweaver,
} from '@kadena/client';
import { createPactCommand, payload } from '@kadena/client/fp';
import * as utils from '@kadena/client/fp';

const main = (
  client: ReturnType<typeof getClient>,
): ((
  sender: string,
  receiver: string,
  amount: `${number}.${number}`,
  publicKey: string,
) => Promise<void>) =>
  async function main(
    sender: string,
    receiver: string,
    amount: `${number}.${number}`,
    publicKey: string,
  ): Promise<void> {
    const getBalanceCommand = createPactCommand(
      payload.exec(Pact.modules.coin['get-balance'](sender)),
      utils.setMeta({ chainId: '1' }),
    );
    const balanceResponse = await client.local(
      createTransaction(getBalanceCommand()),
    );
    if (balanceResponse.result.status === 'success') {
      console.log('balance:', balanceResponse.result.data);
    } else {
      throw new Error(
        `Failed to get balance: \`result.error\`: ${balanceResponse.result.error} `,
      );
    }

    const transferCommand = createPactCommand(
      payload.exec(
        Pact.modules.coin.transfer(sender, receiver, { decimal: amount }),
      ),
      utils.setMeta({
        chainId: '1',
        sender,
        gasLimit: 2400,
        gasPrice: 0.00000001,
      }),
      utils.addSigner(publicKey, (withCapability) => [
        withCapability('coin.GAS'),
        withCapability('coin.TRANSFER', sender, receiver, { decimal: amount }),
      ]),
      utils.setNetworkId('testnet04'),
    );

    const transferTransaction = createTransaction(transferCommand());
    console.log('signing %o', transferTransaction);
    const signedCommand = (await signWithChainweaver(transferTransaction))[0];

    const resLocal = await client.local(signedCommand);
    if (resLocal.result.status === 'success') {
      console.log(
        `test transaction (\`${transferCommand().payload}\`) on /local:`,
        resLocal.result.data,
      );
    } else {
      throw new Error(
        `Failed to test transaction on /local (\`${
          transferCommand().payload
        }\`): ${resLocal.result.error}`,
      );
    }

    const resSend = await client.submit(signedCommand as ICommand);
  };

// eslint-disable-next-line @rushstack/typedef-var
const sender =
  'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94';
// eslint-disable-next-line @rushstack/typedef-var
const receiver =
  'k:e34b62cb48526f89e419dae4e918996d66582b5951361c98ee387665a94b7ad8';
// eslint-disable-next-line @rushstack/typedef-var
const amount = '0.1337';
// eslint-disable-next-line @rushstack/typedef-var
const publicKey =
  '554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94';

// eslint-disable-next-line @rushstack/typedef-var
const client = getClient(
  ({ chainId }) =>
    `https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/${chainId}/pact`,
);

main(client)(sender, receiver, amount, publicKey).catch(console.error);
