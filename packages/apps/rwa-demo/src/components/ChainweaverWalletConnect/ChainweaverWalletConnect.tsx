import { WALLETTYPES } from '@/constants';
import { useAccount } from '@/hooks/account';
import { ContextMenuItem } from '@kadena/kode-ui';
import type { FC } from 'react';

export const ChainweaverWalletConnect: FC = () => {
  const { login } = useAccount();
  const handleConnect = async () => {
    await login(WALLETTYPES.CHAINWEAVER);
  };

  return <ContextMenuItem label="Chainweaver" onClick={handleConnect} />;
};
