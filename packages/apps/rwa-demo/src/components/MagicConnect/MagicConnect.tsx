import { WALLETTYPES } from '@/constants';
import { useAccount } from '@/hooks/account';
import { Button } from '@kadena/kode-ui';
import type { FC } from 'react';

export const MagicConnect: FC = () => {
  const { login } = useAccount();
  const handleConnect = async () => {
    await login(WALLETTYPES.MAGIC);
  };

  return <Button onPress={handleConnect}>Magic Connect</Button>;
};
