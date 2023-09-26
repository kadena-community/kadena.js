import { Tabs } from '@kadena/react-ui';

import type { IModule } from '.';

import dynamic from 'next/dynamic';
import React from 'react';

const AceViewer = dynamic(import('@/components/Global/Ace'), {
  ssr: false,
});

export interface IEditorProps {
  openedModules: Array<IModule & { code: string }>;
}

const moduleToTabId = ({ moduleName, chainId }: IModule): string => {
  return `${moduleName}-${chainId}`;
};

const Editor = ({ openedModules }: IEditorProps) => {
  if (!openedModules.length) {
    return <div>Nothing loaded</div>;
  }
  return (
    <Tabs.Root
      initialTab={moduleToTabId(openedModules[0])}
      currentTab={moduleToTabId(openedModules[0])}
    >
      {openedModules.map(({ moduleName, chainId }) => {
        return (
          <Tabs.Tab
            id={moduleToTabId({ moduleName, chainId })}
            key={moduleToTabId({ moduleName, chainId })}
          >{`${moduleName} @ ${chainId}`}</Tabs.Tab>
        );
      })}

      {openedModules.map(({ moduleName, chainId, code }) => {
        return (
          <Tabs.Content
            key={moduleToTabId({ moduleName, chainId })}
            id={moduleToTabId({ moduleName, chainId })}
          >
            <AceViewer code={code} width="100%" />
          </Tabs.Content>
        );
      })}
    </Tabs.Root>
  );
};

export default Editor;
