import { IAccount, sender00 } from '@devnet/utils';
import {
  ICommandResult,
  IPactModules,
  Pact,
  PactReturnType,
  createSignWithKeypair,
  readKeyset,
} from '@kadena/client';
import { submitClient } from '@kadena/client-utils/core';
import { IClientConfig } from '@kadena/client-utils/lib/core/utils/helpers';
import {
  addKeyset,
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';
import { PactNumber } from '@kadena/pactjs';
import { ChainId } from '@kadena/types';
import { dotenv } from '@utils/dotenv';
import { logger } from '@utils/logger';
import { generateAccount, stringifyProperty } from '../helper';
import { transfer } from './transfer';

interface IFloodOptions {
  iterationsPerSecond: number;
  iterations: number;
  timeout: number;
  chains?: ChainId[];
}

export async function flood({
  iterationsPerSecond,
  iterations,
  timeout,
  chains,
}: IFloodOptions) {
  const startTime = Date.now();

  const account = await generateAccount();
  let count = 0;
  let completedTransfers = 0;

  try {
    while (true) {
      if (count >= iterations) {
        break;
      }

      if (chains) {
        for (const chainId of chains) {
          transfer({
            receiver: account,
            amount: 1,
            chainId,
          })
            .then((result) => {
              completedTransfers++;
              console.log(
                `Transfer ${completedTransfers} complete with status ${result.result.status}`,
              );
            })
            .catch((error) => {
              console.error(error);
            });
          count++;

          console.log(count);
        }
      } else {
        transfer({ receiver: account, amount: 1 }).then((result) => {
          completedTransfers++;
          console.log(
            `Transfer ${completedTransfers} complete with status ${result.result.status}`,
          );
        });
        count++;

        console.log(count);
      }

      if (Date.now() - startTime > timeout) {
        break;
      }

      await new Promise(
        (resolve) => setTimeout(resolve, 1000 / iterationsPerSecond),
        // setTimeout(resolve, 1000),
      );
    }
  } catch (error) {
    console.error(error);
  }
}

interface ICreateTransferInput {
  sender: { account: string; publicKeys: string[] };
  receiver: {
    account: string;
    keyset: {
      keys: string[];
      pred: 'keys-all' | 'keys-2' | 'keys-any';
    };
  };
  amount: string;
  gasPayer?: { account: string; publicKeys: string[] };
  chainId: ChainId;
  /**
   * compatible contract with fungible-v2; default is "coin"
   */
  contract?: string;
  transactionsPerCommand: number;
}

// export const transferCreateCommand = ({
//   sender,
//   receiver,
//   amount,
//   gasPayer = sender,
//   chainId,
//   contract = 'coin',
//   transactionsPerCommand = 1,
// }: ICreateTransferInput) => {
//   const executions = Array.from({ length: transactionsPerCommand }, () =>
//     Pact.modules[contract as 'coin']['transfer-create'](
//       sender.account,
//       receiver.account,
//       readKeyset('account-guard'),
//       {
//         decimal: amount,
//       },
//     ),
//   );

//   return composePactCommand(
//     execution(...executions),
//     addKeyset('account-guard', receiver.keyset.pred, ...receiver.keyset.keys),
//     addSigner(sender.publicKeys, (signFor) => [
//       signFor(
//         `${contract as 'coin'}.TRANSFER`,
//         sender.account,
//         receiver.account,
//         {
//           decimal: amount,
//         },
//       ),
//     ]),
//     addSigner(gasPayer.publicKeys, (signFor) => [signFor('coin.GAS')]),
//     setMeta({ senderAccount: gasPayer.account, chainId }),
//   );
// };

// /**
//  * @alpha
//  */
// export const transferCreate = (
//   inputs: ICreateTransferInput,
//   config: IClientConfig,
// ) =>
//   submitClient<PactReturnType<IPactModules['coin']['transfer-create']>>(config)(
//     transferCreateCommand(inputs),
//   );

// export async function transfer({
//   receiver,
//   chainId = dotenv.SIMULATE_DEFAULT_CHAIN_ID,
//   sender = sender00,
//   amount = 100,
//   txPerCommand = 1,
// }: {
//   receiver: IAccount;
//   chainId?: ChainId;
//   sender?: IAccount;
//   amount?: number;
//   txPerCommand?: number;
// }): Promise<ICommandResult> {
//   const pactAmount = new PactNumber(amount).toPactDecimal();

//   logger.info(
//     `Transfering from ${sender.account} to ${
//       receiver.account
//     }\nPublic Key: ${stringifyProperty(receiver.keys, 'publicKey')}\nAmount: ${
//       pactAmount.decimal
//     }`,
//   );

//   return transferCreate(
//     {
//       amount: pactAmount.decimal,
//       chainId,
//       receiver: {
//         account: receiver.account,
//         keyset: {
//           keys: receiver.keys.map((key) => key.publicKey),
//           pred: 'keys-all',
//         },
//       },
//       sender: {
//         account: sender.account,
//         publicKeys: sender.keys.map((key) => key.publicKey),
//       },
//       transactionsPerCommand: txPerCommand,
//     },
//     {
//       host: dotenv.NETWORK_HOST,
//       defaults: {
//         networkId: dotenv.NETWORK_ID,
//       },
//       sign: createSignWithKeypair(sender.keys),
//     },
//   ).executeTo('listen');
// }
