import { Fungible } from '@/hooks/accounts.hook';
import {
  ChainId,
  ICommandResult,
  Pact,
  createTransaction,
} from '@kadena/client';
import {
  addSigner,
  composePactCommand,
  execution,
  setMeta,
  setNetworkId,
} from '@kadena/client/fp';
import { Layer, asyncPipe, getInfo, send } from './helpers';

export const getAccountBalances = async ({
  account,
  fungibles,
  networkId = 'fast-development',
  layer = 'l1',
}: {
  account: string;
  fungibles: Fungible[];
  networkId?: string;
  layer?: Layer;
}): Promise<
  PromiseSettledResult<{
    pactResult: ICommandResult;
    fungible: Fungible;
    chainId: ChainId;
  }>[]
> => {
  const transactions = fungibles
    .map((fungible) =>
      fungible.chainIds.map((chainId) =>
        asyncPipe(
          composePactCommand(
            execution(
              (Pact.modules as any)[fungible.contract]['get-balance'](account),
            ),
          ),
          getInfo({ networkId, layer, chainId }),
          (pactResult) => {
            return {
              pactResult,
              fungible,
              chainId,
            };
          },
        )({}),
      ),
    )
    .flat();

  return Promise.allSettled(transactions);
};

export const transfer = ({
  sender,
  receiver,
  amount,
  senderKey,
  chainId,
  seed,
  index,
  networkId = 'fast-development',
  layer = 'l1',
}: {
  sender: string;
  receiver: string;
  amount: number;
  senderKey: string;
  chainId: ChainId;
  seed: Uint8Array;
  index: number;
  networkId?: string;
  layer?: Layer;
}) =>
  asyncPipe(
    composePactCommand(
      execution(
        (Pact.modules as any).coin['transfer'](sender, receiver, {
          decimal: amount.toString(),
        }),
      ),
      addSigner(senderKey, (withCapability: any) => [
        withCapability('coin.GAS'),
        withCapability('coin.TRANSFER', sender, receiver, {
          decimal: amount.toString(),
        }),
      ]),
    ),
    send({ networkId, layer, chainId, seed, index, senderAccount: sender }),
  )({});

export const createTransferTransaction = ({
  sender,
  receiver,
  amount,
  senderKey,
  chainId,
  networkId = 'fast-development',
}: {
  sender: string;
  receiver: string;
  amount: number;
  senderKey: string;
  chainId: ChainId;
  networkId?: string;
  layer?: Layer;
}) => {
  const pactCommand = composePactCommand(
    execution(
      (Pact.modules as any).coin['transfer'](sender, receiver, {
        decimal: amount.toString(),
      }),
    ),
    addSigner(senderKey, (withCapability: any) => [
      withCapability('coin.GAS'),
      withCapability('coin.TRANSFER', sender, receiver, {
        decimal: amount.toString(),
      }),
    ]),
    setNetworkId(networkId),
    setMeta({ chainId, senderAccount: sender }),
  );

  return createTransaction(pactCommand());
};
