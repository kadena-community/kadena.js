import { ChainId } from "@kadena/types";

export const accountDefaults = {
  sender00: {
    name: 'sender00',
    account: 'sender00',
    keyset: 'sender00',
    network: 'devnet',
    chainId: '1' as ChainId,
  },
};

export const defaultAccountsPath: string = `${process.cwd()}/.kadena/accounts`;
