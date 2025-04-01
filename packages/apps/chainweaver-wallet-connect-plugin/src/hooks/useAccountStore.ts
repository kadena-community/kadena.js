import { useEffect, useRef, useState, Dispatch, SetStateAction } from 'react';
import { IAccount } from '../wallet-communication';

const LOCALSTORAGE_KEY = 'accountStore';

export interface AccountStore {
  [id: string]: Array<{ name: string; account: IAccount; publicKey: string }>;
}

const useAccountStore = (): [AccountStore, Dispatch<SetStateAction<AccountStore>>, React.MutableRefObject<AccountStore>] => {
  const [accountStore, setAccountStore] = useState<AccountStore>({});
  const accountStoreRef = useRef(accountStore);

  // Load accountStore from localStorage on mount
  useEffect(() => {
    const storedAccounts = localStorage.getItem(LOCALSTORAGE_KEY);
    if (storedAccounts) {
      setAccountStore(JSON.parse(storedAccounts));
    }
  }, []);

  // Save accountStore to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(accountStore));
    accountStoreRef.current = accountStore;  // Update ref whenever state changes
  }, [accountStore]);

  return [accountStore, setAccountStore, accountStoreRef];
};

export default useAccountStore;