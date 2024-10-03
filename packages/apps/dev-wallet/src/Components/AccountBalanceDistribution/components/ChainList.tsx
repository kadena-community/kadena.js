import { ChainId } from '@kadena/client';
import { Badge, Stack } from '@kadena/kode-ui';
import type { FC, PropsWithChildren } from 'react';
import { useMemo } from 'react';
import { IViewChain } from '../processChainAccounts';
import { ChainBalance } from './ChainBalance';

interface IProps extends PropsWithChildren {
  chains: IViewChain[];
  fundAccount: (chainId: ChainId) => Promise<void>;
}
export const ChainList: FC<IProps> = ({ chains, fundAccount }) => {
  return (
    <Stack flex={1} flexDirection="column" width="100%" gap="sm">
      <Stack
        as="ul"
        flexDirection="column"
        width="100%"
        gap="sm"
        marginInline="no"
        paddingInline="no"
      >
        {chains.map((chainAccount, idx) => (
          <ChainBalance
            key={`${idx}`}
            chainAccount={chainAccount}
            chainId={chainAccount.chainId}
            fundAccount={fundAccount}
          />
        ))}
      </Stack>
    </Stack>
  );
};
