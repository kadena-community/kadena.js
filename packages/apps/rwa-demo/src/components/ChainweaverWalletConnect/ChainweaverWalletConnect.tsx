import { WALLETTYPES } from '@/constants';
import { ContextMenuItem } from '@kadena/kode-ui';
import type { FC } from 'react';

export const ChainweaverWalletConnect: FC<{
  handleConnect: (type: keyof typeof WALLETTYPES) => void;
}> = ({ handleConnect }) => {
  return (
    <ContextMenuItem
      label="Chainweaver"
      onClick={() => handleConnect(WALLETTYPES.CHAINWEAVER)}
    />
  );
};
