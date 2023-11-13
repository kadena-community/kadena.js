import type { contractParser } from '@kadena/pactjs-generator';
import type { ITreeProps } from '@kadena/react-ui';
import { Button } from '@kadena/react-ui';
import React from 'react';
import type { IOutlineProps } from './outline';

export type Contract = ReturnType<typeof contractParser>[0][0]; // TODO: Should we improve this because it's a bit hacky?

export const contractToTreeItems = (
  contract: Contract,
  onInterfaceClick: IOutlineProps['onInterfaceClick'],
  module: IOutlineProps['selectedModule'],
): ITreeProps['items'] => {
  const { usedInterface: interfaces, capabilities, functions } = contract;
  const items: ITreeProps['items'] = [];

  if (interfaces?.length) {
    items.push({
      title: 'Interfaces',
      isOpen: true,
      items: interfaces.map((i) => ({
        title: (
          <Button
            onClick={() =>
              onInterfaceClick({ chainId: module!.chainId, moduleName: i.name })
            }
            variant="compact"
            icon="ExitToApp"
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
