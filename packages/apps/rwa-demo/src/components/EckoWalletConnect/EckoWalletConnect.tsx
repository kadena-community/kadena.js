import { WALLETTYPES } from '@/constants';
import { useAccount } from '@/hooks/account';
import { ContextMenuItem } from '@kadena/kode-ui';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import type { IECKOWindow } from './eckotypes';

export const EckoWalletConnect: FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { login } = useAccount();
  const handleConnect = async () => {
    await login(WALLETTYPES.ECKO);
  };

  useEffect(() => {
    const { kadena } = window as IECKOWindow;
    const isKadena = Boolean(kadena && kadena.isKadena);
    setIsMounted(isKadena);
  }, []);

  return (
    <ContextMenuItem
      label="Ecko Wallet"
      onClick={handleConnect}
      isDisabled={!isMounted}
    />
  );
};
