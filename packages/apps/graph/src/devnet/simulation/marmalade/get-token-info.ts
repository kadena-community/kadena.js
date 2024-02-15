import type { ChainId, IPactModules, PactReturnType } from '@kadena/client';
import { Pact } from '@kadena/client';
import { dirtyReadClient } from '@kadena/client-utils/core';
import { composePactCommand, execution, setMeta } from '@kadena/client/fp';
import { dotenv } from '@utils/dotenv';

interface TokenInfo {
  supply: number;
  precision: number;
  uri: string;
  id: string;
  policies: string[];
}

export const getTokenInfo = async (
  tokenId: string,
  chainId: ChainId,
): Promise<TokenInfo | undefined> => {
  const command = composePactCommand(
    execution(Pact.modules['marmalade-v2.ledger']['get-token-info'](tokenId)),
    setMeta({
      chainId,
    }),
  );

  const config = {
    host: dotenv.NETWORK_HOST,
    defaults: {
      networkId: dotenv.NETWORK_ID,
    },
  };

  const tokenInfo =
    await dirtyReadClient<
      PactReturnType<IPactModules['marmalade-v2.ledger']['get-token-info']>
    >(config)(command).execute();

  if (!tokenInfo) {
    return undefined;
  }

  if ('precision' in tokenInfo) {
    if (
      typeof tokenInfo.precision === 'object' &&
      tokenInfo.precision !== null
    ) {
      tokenInfo.precision = (tokenInfo.precision as { int: number }).int;
    }
  }

  return tokenInfo as TokenInfo;
};
