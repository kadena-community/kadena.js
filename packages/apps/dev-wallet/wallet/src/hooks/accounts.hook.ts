import { ChainId } from "@kadena/client";
import { useLocalStorage } from "usehooks-ts";

export interface Account {
  account: string;
  name?: string;
  pred: "keys-all" | "keys-two" | "keys-one";
  keys: string[];
}

export type Fungible = {
  contract: string;
  symbol: string;
  chainIds: ChainId[];
};

export const ACCOUNTS = "kadena_accounts";

export const useAccounts = () => {
  const [accountsList, setAccountsList] = useLocalStorage<Account[]>(
    ACCOUNTS,
    []
  );

  function addAccount(account: Account) {
    const index = accountsList.findIndex((a) => a.account === account.account);
    if (index !== -1) {
      accountsList[index] = account;
    } else {
      accountsList.push(account);
    }
    setAccountsList([...accountsList]);
  }

  return {
    addAccount,
    accountsList,
    clear: () => setAccountsList([]),
  };
};
