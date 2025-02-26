import { WALLETTYPES } from '@/constants';
import { useAccount } from '@/hooks/account';
import { ContextMenuItem } from '@kadena/kode-ui';
import type { FC } from 'react';

export const MagicConnect: FC = () => {
  const { login } = useAccount();
  const handleConnect = async () => {
    console.log(11111);
    await login(WALLETTYPES.MAGIC);
  };

  return (
    <ContextMenuItem label="Magic Connect (spirekey)" onClick={handleConnect} />
  );
};
