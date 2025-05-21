import { WALLETTYPES } from '@/constants';
import { ContextMenuItem } from '@kadena/kode-ui';
import type { FC } from 'react';

export const MagicConnect: FC<{
  handleConnect: (type: keyof typeof WALLETTYPES) => void;
}> = ({ handleConnect }) => {
  return (
    <ContextMenuItem
      label="Magic Connect (spirekey)"
      onClick={() => handleConnect(WALLETTYPES.CHAINWEAVER)}
    />
  );
};
