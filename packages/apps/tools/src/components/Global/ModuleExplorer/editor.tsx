import { Heading, Tabs } from '@kadena/react-ui';

import type { IChainModule } from './types';

import dynamic from 'next/dynamic';
import React from 'react';

const AceViewer = dynamic(import('@/components/Global/Ace'), {
  ssr: false,
});

export interface IEditorProps {
  openedModules: IChainModule[];
}

const moduleToTabId = ({ moduleName, chainId }: IChainModule): string => {
  return `${moduleName}-${chainId}`;
};

const Editor = ({ openedModules }: IEditorProps): React.JSX.Element => {
  if (!openedModules.length) {
    return (
      <section>
        <Heading variant="h4">No code to be shown yet</Heading>
        <p>
          Click on a module from the left panel to see its code in this panel.
        </p>
      </section>
    );
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
