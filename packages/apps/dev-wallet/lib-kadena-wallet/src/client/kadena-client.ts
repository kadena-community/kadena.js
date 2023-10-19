import { RemoteConnectionClient } from "./remote-client.js";
import type { IUnsignedCommand } from "@kadena/client";
import { createTransferTransaction } from "../transactions.js";
import { createRegistryTransfer, getAccountBalance } from "../transfer.js";
import { resolveAccountAlias } from "../registry/registry.js";

export class KadenaRemoteClient extends RemoteConnectionClient {
  async sign(transaction: IUnsignedCommand) {
    return this.send("sign", transaction);
  }

  async getPublicKeys() {
    return this.send("getPublicKeys", null);
  }

  async resolveAlias(alias: string) {
    // via wallet, not needed for registry lookup
    // return this.send<Alias>("resolveAlias", alias);

    // direct lookup from client, skipping wallet
    return resolveAccountAlias(alias);
  }

  async transfer({
    from,
    fromAlias,
    to,
    toAlias,
    amount,
  }: {
    from: string;
    fromAlias?: string;
    to: string;
    toAlias?: string;
    amount: number;
  }) {
    const fromBalances = await this.getAccountBalance(from);
    const transfers = createRegistryTransfer(
      {
        name: from,
        balances: fromBalances,
      },
      {
        name: to,
        balances: [],
      },
      amount
    );
    if (!transfers) return null;
    console.log("client transfer", transfers);

    const transactions = transfers.map((transfer) => {
      return createTransferTransaction({
        sender: from,
        senderKey: from.slice(2),
        receiver: to,
        amount: transfer[1],
        chainId: transfer[0],
      });
    });

    if (!fromAlias || !toAlias) return console.log("no alias set");

    return this.send("registryTransfer", {
      fromAlias,
      toAlias,
      transactions,
    });
  }

  async getAccountBalance(account: string) {
    return getAccountBalance(account);
  }
}
