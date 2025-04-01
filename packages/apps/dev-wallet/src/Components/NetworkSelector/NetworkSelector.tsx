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
  Link as UILink,
} from '@kadena/kode-ui';
import { FC } from 'react';
import { Link } from 'react-router-dom';

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
      <UILink
        data-testid="networkselectorName"
        isCompact
        variant="outlined"
        component={Link}
        href="/networks"
        startVisual={
          activeNetwork?.isHealthy === false ? (
            <MonoWifiTetheringOff />
          ) : (
            <MonoWifiTethering />
          )
        }
      >
        {showLabel ? activeNetwork?.name : undefined}
      </UILink>

      {showLabel && (
        <ContextMenu
          trigger={
            <Button
              data-testid="networkselector"
              variant={variant}
              isCompact={isCompact}
              startVisual={<MonoMoreVert />}
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
            label="Settings"
            endVisual={<MonoSettings />}
            onClick={handlePress}
          />
        </ContextMenu>
      )}
    </ButtonGroup>
  );
};
