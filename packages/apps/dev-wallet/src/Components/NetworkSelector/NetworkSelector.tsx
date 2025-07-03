import { useWallet } from '@/modules/wallet/wallet.hook';
import { usePatchedNavigate } from '@/utils/usePatchedNavigate';
import {
  MonoCheck,
  MonoMoreVert,
  MonoSettings,
  MonoWifiTethering,
  MonoWifiTetheringOff,
} from '@kadena/kode-icons/system';
import {
  Button,
  ButtonGroup,
  ContextMenu,
  ContextMenuDivider,
  ContextMenuItem,
  IButtonProps,
} from '@kadena/kode-ui';
import { FC } from 'react';

export const NetworkSelector: FC<{
  showLabel?: boolean;
  variant: IButtonProps['variant'];
  isCompact?: IButtonProps['isCompact'];
}> = ({ showLabel = true, variant, isCompact = false }) => {
  const { networks, activeNetwork, setActiveNetwork } = useWallet();
  const navigate = usePatchedNavigate();

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
    <ButtonGroup fullWidth>
      {showLabel && (
        <Button
          textAlign="start"
          data-testid="networkselectorName"
          isCompact
          variant="outlined"
          startVisual={
            activeNetwork?.isHealthy === false ? (
              <MonoWifiTetheringOff />
            ) : (
              <MonoWifiTethering />
            )
          }
        >
          {activeNetwork?.name}
        </Button>
      )}

      <ContextMenu
        trigger={
          <Button
            data-testid="networkselector"
            variant={variant}
            isCompact={isCompact}
            startVisual={showLabel ? <MonoMoreVert /> : <MonoWifiTethering />}
          />
        }
      >
        {networks.map((network) => (
          <ContextMenuItem
            aria-label={network.name}
            key={network.networkId}
            label={network.name ?? network.networkId}
            endVisual={
              network.uuid === activeNetwork?.uuid ? <MonoCheck /> : undefined
            }
            onClick={() => handleNetworkUpdate(network.uuid)}
          />
        ))}
        <ContextMenuDivider />
        <ContextMenuItem
          label="Network settings"
          endVisual={<MonoSettings />}
          onClick={handlePress}
        />
      </ContextMenu>
    </ButtonGroup>
  );
};
