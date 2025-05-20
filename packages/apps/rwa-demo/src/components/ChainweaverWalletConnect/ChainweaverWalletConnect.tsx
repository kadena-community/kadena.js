import { WALLETTYPES } from '@/constants';
import { useAccount } from '@/hooks/account';
import type { IWalletAccount } from '@/providers/WalletProvider/WalletType';
import { chainweaverAccountLogin } from '@/utils/walletTransformers/chainweaver/login';
import {
  Button,
  ContextMenuItem,
  Dialog,
  DialogContent,
  DialogHeader,
  maskValue,
  Stack,
  Text,
} from '@kadena/kode-ui';
import type { FC } from 'react';
import { useState } from 'react';

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
