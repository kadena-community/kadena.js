import { useNetwork } from '@/context/networksContext';
import { EVENT_NAMES, analyticsEvent } from '@/utils/analytics';
import { MonoSettings } from '@kadena/kode-icons/system';
import { Button, Select, SelectItem, Stack } from '@kadena/kode-ui';
import type { FC } from 'react';
import React, { useState } from 'react';
import { Media } from '../Layout/media';
import { ConfigNetwork } from './ConfigNetwork';

export const SelectNetwork: FC = () => {
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
      <Stack>
        <Media greaterThanOrEqual="md">
          <Select
            size="lg"
            aria-label="Select network"
            selectedKey={activeNetwork!.slug}
            fontType="code"
            onSelectionChange={handleSelectNetwork}
          >
            {
              networks.map((network) => (
                <SelectItem
                  key={network.slug ?? network.label}
                  textValue={network.label}
                >
                  <Stack paddingInlineEnd="md" style={{ whiteSpace: 'nowrap' }}>
                    {network.label}
                  </Stack>
                </SelectItem>
              )) as any
            }
          </Select>
        </Media>
        <Button
          onPress={handlePress}
          variant="transparent"
          endVisual={<MonoSettings />}
        />
      </Stack>
      {isOpen && <ConfigNetwork handleOpen={setIsOpen} />}
    </>
  );
};
