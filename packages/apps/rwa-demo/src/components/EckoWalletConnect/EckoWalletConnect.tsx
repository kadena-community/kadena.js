import { WALLETTYPES } from '@/constants';
import { ContextMenuItem } from '@kadena/kode-ui';
import type { FC } from 'react';
import { useState } from 'react';
import type { IECKOWindow } from './eckotypes';

export const EckoWalletConnect: FC<{
  handleConnect: (type: keyof typeof WALLETTYPES) => void;
}> = ({ handleConnect }) => {
  const [isMounted] = useState(() => {
    const { kadena } = window as IECKOWindow;
    const isKadena = Boolean(kadena && kadena.isKadena);
    return isKadena;
  });

  return (
    <ContextMenuItem
      label="Ecko Wallet"
      onClick={() => handleConnect(WALLETTYPES.CHAINWEAVER)}
      isDisabled={!isMounted}
    />
  );
};
