import { useNetwork } from '@/context/networksContext';
import { EVENT_NAMES, analyticsEvent } from '@/utils/analytics';
import { MonoMoreVert, MonoSettings } from '@kadena/kode-icons/system';
import type { IContextMenuProps } from '@kadena/kode-ui';
import {
  Button,
  ContextMenu,
  ContextMenuItem,
  Media,
  Stack,
  Text,
} from '@kadena/kode-ui';
import type { FC } from 'react';
import React, { useState } from 'react';
import { ConfigNetwork } from './ConfigNetwork';
import {
  selectorButtonClass,
  selectorClass,
  selectorClassWrapper,
} from './style.css';

interface IProps {
  placement?: IContextMenuProps['placement'];
}

export const SelectNetwork: FC<IProps> = ({ placement = 'bottom end' }) => {
  const { networks, activeNetwork, setActiveNetwork } = useNetwork();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectNetwork = (value: any): void => {
    setActiveNetwork(value);
  };

  const handlePress = () => {
    setIsOpen(true);
    analyticsEvent(EVENT_NAMES['click:open_configDialog'], {});
  };

  if (!networks) return null;

  return (
    <>
      <Stack className={selectorClassWrapper}>
        <Media greaterThanOrEqual="md">
          <Text className={selectorClass}>{activeNetwork.label}</Text>
        </Media>
        <ContextMenu
          placement={placement}
          trigger={
            <Button
              variant="transparent"
              endVisual={<MonoMoreVert />}
              className={selectorButtonClass}
            />
          }
        >
          {networks.map((network) => (
            <ContextMenuItem
              aria-label={network.label}
              key={network.slug ?? network.label}
              label={network.label}
              onClick={() => handleSelectNetwork(network.slug)}
            />
          ))}
          <ContextMenuItem
            label="Settings"
            endVisual={<MonoSettings />}
            onClick={handlePress}
          />
        </ContextMenu>
      </Stack>
      {isOpen && <ConfigNetwork handleOpen={setIsOpen} />}
    </>
  );
};
