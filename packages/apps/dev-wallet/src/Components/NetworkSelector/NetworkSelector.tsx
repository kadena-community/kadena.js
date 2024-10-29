import { useWallet } from '@/modules/wallet/wallet.hook';
import { MonoSettings, MonoWifiTethering } from '@kadena/kode-icons/system';
import {
  Button,
  ContextMenu,
  ContextMenuDivider,
  ContextMenuItem,
  Stack,
} from '@kadena/kode-ui';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';

export const NetworkSelector: FC<{ showLabel?: boolean }> = ({
  showLabel = true,
}) => {
  const { networks, activeNetwork, setActiveNetwork } = useWallet();
  const navigate = useNavigate();

  const handleNetworkUpdate = (uuid: string) => {
    const network = networks.find((network) => network.uuid === uuid);
    if (network && setActiveNetwork) {
      setActiveNetwork(network);
    }
  };

  const handlePress = () => {
    navigate('/networks');
  };

  return (
    <Stack>
      {showLabel && (
        <>
          <MonoWifiTethering />
          {activeNetwork?.name}
        </>
      )}
      <ContextMenu
        trigger={
          <Button variant="transparent" endVisual={<MonoWifiTethering />} />
        }
      >
        {networks.map((network) => (
          <ContextMenuItem
            aria-label={network.name}
            key={network.networkId}
            label={network.name ?? network.networkId}
            onClick={() => handleNetworkUpdate(network.uuid)}
          />
        ))}
        <ContextMenuDivider />
        <ContextMenuItem
          label="Settings"
          endVisual={<MonoSettings />}
          onClick={handlePress}
        />
      </ContextMenu>
    </Stack>
  );
};
