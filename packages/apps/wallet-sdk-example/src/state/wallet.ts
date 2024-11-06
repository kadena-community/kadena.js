import {
  isSignedTransaction,
  type ChainId,
  type IUnsignedCommand,
} from '@kadena/client';
import {
  EncryptedString,
  kadenaGenKeypairFromSeed,
  kadenaGenMnemonic,
  kadenaMnemonicToSeed,
  kadenaSignWithSeed,
} from '@kadena/hd-wallet';
import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useEffect, useMemo } from 'react';
import { ICommandPayload } from '../../../../libs/types/dist/types';

export type Account = {
  index: number;
  publicKey: string;
  name: string;
};

const seedAtom = atomWithStorage<null | EncryptedString>(
  'mmnemonic_seed',
  null,
);
const selectedChainAtom = atomWithStorage<ChainId>('network_id', '0');
const selectedNetworkAtom = atomWithStorage('network_id', 'testnet04');
const selectedFungibleAtom = atomWithStorage('selected_fungible', 'coin');
const accountsAtom = atomWithStorage<Account[]>('accounts', []);
const selectedAccountAtom = atomWithStorage<null | number>(
  'selected_account',
  null,
);

const passwordAtom = atom<null | string>(null);

export const useWalletState = (initialPassword?: string) => {
  // Persisted state
  const [selectedFungible] = useAtom(selectedFungibleAtom);
  const [selectedNetwork] = useAtom(selectedNetworkAtom);
  const [selectedChain] = useAtom(selectedChainAtom);
  const [accounts, setAccounts] = useAtom(accountsAtom);
  const [seed, setSeed] = useAtom(seedAtom);
  // Temporary state
  const [password, setPassword] = useAtom(passwordAtom);
  const [selectedAccount, setSelectedAccount] = useAtom(selectedAccountAtom);

  // Initialize state when password is available
  useEffect(() => {
    if (password === null && initialPassword !== undefined) {
      setPassword(initialPassword);
    }
  }, [password, initialPassword, setPassword]);

  const privateGenerateAccount = async (
    seed: EncryptedString,
    index: number,
  ) => {
    if (!password) throw new Error('Password not set');
    const [publicKey] = await kadenaGenKeypairFromSeed(password, seed, index);
    const account = { index, publicKey, name: `k:${publicKey}` };
    setAccounts((prev) => [...prev, account]);
    return account;
  };

  const selectAccount = async (index: number) => {
    if (!accounts.some((account) => account.index === index)) {
      throw new Error('Account not found');
    }
    setSelectedAccount(index);
  };

  /**
   * Generates a new mnemonic phrase, does not internally use it yet
   * Prompt the user to store the phrase safely then pass it to `changeMnemonicWords`
   */
  const generateMnemonic = () => {
    const mnemonic = kadenaGenMnemonic();
    return mnemonic;
  };

  const changeMnemonicWords = async (words: string) => {
    if (!password) throw new Error('Password not set');
    const seed = await kadenaMnemonicToSeed(password, words);
    setAccounts([]);
    setSeed(seed);
    const account = await privateGenerateAccount(seed, 0);
    setSelectedAccount(account.index);
  };

  const generateAccount = async (indexParam?: number) => {
    if (!seed) throw new Error('Seed not set');
    const index = indexParam ? indexParam : accounts.length;
    await privateGenerateAccount(seed, index);
  };

  const signTransaction = async (command: IUnsignedCommand) => {
    if (!password) throw new Error('Password not set');
    if (!seed) throw new Error('Seed not set');
    console.log('signTransaction', command);
    const cmd = JSON.parse(command.cmd) as ICommandPayload;
    for (let i = 0; i < cmd.signers.length; i++) {
      const singer = cmd.signers[i];
      const match = accounts.find(
        (account) => account.publicKey === singer.pubKey,
      );
      if (match) {
        const sig = await kadenaSignWithSeed(
          password,
          seed,
          match.index,
        )(command.hash);
        command.sigs[i] = sig;
      }
    }
    if (isSignedTransaction(command)) {
      return command;
    } else {
      throw new Error('Not signed');
    }
  };

  // console.log({ accounts, seed });

  const account = useMemo(
    () => accounts.find((account) => account.index === selectedAccount),
    [accounts, selectedAccount],
  );

  return {
    account,
    accounts,
    selectedFungible,
    selectedNetwork,
    selectedChain,
    generateMnemonic,
    selectAccount,
    changeMnemonicWords,
    generateAccount,
    signTransaction,
  };
};
