import { createTokenId } from '@kadena/client-utils/marmalade';
import type { Command } from 'commander';
import debug from 'debug';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';

export const mintCommand: (program: Command, version: string) => void =
  createCommand(
    'mint',
    'mint a new NFT on Marmalade',
    [globalOptions.network(true)],
    async (config) => {
      debug('marmalade-mint:action')({ config });
      const tokenId = createTokenId(
        {
          account: {
            account: '123',
            publicKeys: [],
          },
          gasPayer: {
            account: '123',
            publicKeys: [],
          },
          chainId: '1',
          uri: 'https://example.com',
          policies: [],
          creationGuard: {
            keys: [],
            pred: 'keys-all',
          },
        },
        {
          // TODO: fix this (sign method?)
        },
      );
      console.log(tokenId);
      // mintNFT
    },
  );
