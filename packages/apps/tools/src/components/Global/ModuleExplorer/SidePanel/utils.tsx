import type { contractParser } from '@kadena/pactjs-generator';
import { MonoExitToApp } from '@kadena/react-icons/system';
import type { ITreeProps } from '@kadena/react-ui';
import { Button } from '@kadena/react-ui';
import React from 'react';
import type { IOutlineProps } from './outline';

export type Contract = ReturnType<typeof contractParser>[0][0]; // TODO: Should we improve this because it's a bit hacky?

export const contractToTreeItems = (
  contract: Contract,
  onInterfaceClick: IOutlineProps['onInterfaceClick'],
  module: IOutlineProps['selectedModule'],
  onInterfacesExpand: IOutlineProps['onInterfacesExpand'],
): ITreeProps['items'] => {
  const { usedInterface: interfaces, capabilities, functions } = contract;
  const items: ITreeProps['items'] = [];

  if (interfaces?.length) {
    items.push({
      title: 'Interfaces',
      // isOpen: true,
      onOpen: () => {
        onInterfacesExpand(
          interfaces.map((i) => {
            return {
              chainId: module!.chainId,
              moduleName: i.name,
              network: module!.network,
            };
          }),
        );
      },
      items: interfaces.map((i) => ({
        title: (
          <Button
            onPress={() =>
              onInterfaceClick({
                chainId: module!.chainId,
                moduleName: i.name,
                network: module!.network,
              })
            }
            isCompact
            endVisual={<MonoExitToApp />}
          >
            {i.name}
          </Button>
        ),
      })),
    });
  }

  if (capabilities?.length) {
    items.push({
      title: 'Capabilities',
      items: capabilities.map((c) => ({
        title: c.name,
      })),
    });
  }

  if (functions?.length) {
    items.push({
      title: 'Functions',
      items: functions.map((f) => ({
        title: f.name,
      })),
    });
  }

  return items;
};

export const contractToAccordionItems = (contract: Contract) => {
  const { usedInterface: interfaces, capabilities, functions } = contract;
  const items = [];

  if (interfaces?.length) {
    items.push({
      title: 'Interfaces',
      items: interfaces.map((i) => ({
        title: i.name,
      })),
    });
  }

  if (capabilities?.length) {
    items.push({
      title: 'Capabilities',
      items: capabilities.map((c) => ({
        title: c.name,
      })),
    });
  }

  if (functions?.length) {
    items.push({
      title: 'Functions',
      items: functions.map((f) => ({
        title: f.name,
      })),
    });
  }

  return items;
};
