import { ChainId } from "@kadena/client";
import { getClient, createGetBalanceTransaction } from "./transactions.js";

const chains = 20;

export const getAccountBalance = async (account: string) => {
  const getQuery = async (chainId: ChainId) => {
    const client = getClient(8081);
    const transaction = createGetBalanceTransaction({
      account: account!,
      chainId,
      networkId: "fast-development",
    });
    const result = await client.local(transaction, {
      preflight: false,
      signatureVerification: false,
    });
    return result;
  };

  const promises = Array.from({ length: chains }, (_, i) =>
    getQuery(String(i) as ChainId)
  );

  const results = await Promise.all(promises);

  return results.map((result) => {
    return result.result.status === "success"
      ? (result.result.data as number as number)
      : 0;
  });
};

type Account = {
  name: string;
  balances: number[];
};

/**
 * Create a registry transfer from one account to another
 * Automatically calculates the amount to send to each chain
 *
 * Currently does not consider the `to` account's balances.
 * Ideally we would prefer transfers on chains where the `to` account
 * also has a balance, but for this POC the logic is simplified
 *
 * @returns
 */
export const createRegistryTransfer = (
  from: Account,
  _to: Account,
  amount: number
) => {
  const perChain = [] as [ChainId, number][];
  let amountLeft = amount;

  for (let i = 0; i < chains; i++) {
    if (amountLeft <= 0) break;
    const chainId = String(i) as ChainId;
    const fromBalance = from.balances[chainId] ?? 0;
    const fromChain = Math.min(amountLeft, fromBalance);
    amountLeft = amountLeft - fromChain;
    perChain.push([chainId, fromChain]);
  }

  if (amountLeft > 0) {
    return null;
  }

  return perChain;
};
