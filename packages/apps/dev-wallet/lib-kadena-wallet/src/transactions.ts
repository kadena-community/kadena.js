import { ChainId, createClient, createTransaction, Pact } from "@kadena/client";

import {
  addSigner,
  composePactCommand,
  execution,
  setMeta,
  setNetworkId,
  setNonce,
} from "@kadena/client/fp";

const Modules = Pact.modules as {
  coin: {
    transfer: (...args: unknown[]) => string;
    "get-balance": (...args: unknown[]) => string;
  };
};

export const getClient = (port: number) =>
  createClient(
    ({ chainId, networkId }) =>
      `http://localhost:${port}/chainweb/0.0/${networkId}/chain/${chainId}/pact`
  );

export const createTransferTransaction = ({
  sender,
  receiver,
  amount,
  senderKey,
  chainId,
  networkId = "fast-development",
  nonce,
}: {
  sender: string;
  receiver: string;
  amount: number;
  senderKey: string;
  chainId: ChainId;
  networkId?: string;
  nonce?: string;
}) => {
  const pactCommand = composePactCommand(
    execution(
      Modules.coin["transfer"](sender, receiver, {
        decimal: amount.toString(),
      })
    ),
    addSigner(senderKey, (withCapability) => [
      withCapability("coin.GAS"),
      withCapability("coin.TRANSFER", sender, receiver, {
        decimal: amount.toString(),
      }),
    ]),
    setNetworkId(networkId),
    setMeta({ chainId, senderAccount: sender }),
    setNonce(nonce ?? "")
  );

  return createTransaction(pactCommand());
};

export const createGetBalanceTransaction = ({
  account,
  networkId,
  chainId,
}: {
  account: string;
  networkId: string;
  chainId: ChainId;
}) => {
  const pactCommand = composePactCommand(
    execution(Modules.coin["get-balance"](account)),
    setNetworkId(networkId),
    setMeta({ chainId })
  );
  return createTransaction(pactCommand());
};
