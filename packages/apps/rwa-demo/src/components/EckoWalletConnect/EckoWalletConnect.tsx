import { WALLETTYPES } from '@/constants';
import { useAccount } from '@/hooks/account';
import { Button } from '@kadena/kode-ui';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

export const EckoWalletConnect: FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { login } = useAccount();
  const handleConnect = async () => {
    await login(WALLETTYPES.ECKO);
  };

  useEffect(() => {
    const { kadena } = window as any;
    const isKadena = Boolean(kadena && kadena.isKadena);
    setIsMounted(isKadena);
  }, []);

  return (
    <Button onPress={handleConnect} isDisabled={!isMounted}>
      Ecko Connect
    </Button>
  );
};
