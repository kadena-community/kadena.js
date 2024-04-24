import type { ChainwebChainId } from '@kadena/chainweb-node-client';
import { MonoExitToApp } from '@kadena/react-icons/system';
import type { ITreeProps } from '@kadena/react-ui';
import { Accordion, AccordionItem, Button, Text, Tree } from '@kadena/react-ui';
import React, { useMemo } from 'react';
import type { IChainModule } from '../types';
import type { getModulesMap } from '../utils';
import { moduleTitle } from './styles.css';

export interface IResultsProps extends React.HTMLAttributes<HTMLDivElement> {
  data: ReturnType<typeof getModulesMap>;
  onItemClick: (result: IChainModule) => void;
  onModuleExpand: (module: {
    moduleName: string;
    chains: ChainwebChainId[];
  }) => void;
  filter?: string;
}

const truncateString = (str: string, maxChars: number): string => {
  if (str.length <= maxChars) return str;
  return `${str.slice(0, maxChars)}...`;
};

const CHARCOUNT_BREAKING_POINT = 15;

const resultsMapToTreeItems = (
  data: IResultsProps['data'],
  onItemClick: IResultsProps['onItemClick'],
  onModuleExpand: IResultsProps['onModuleExpand'],
): ITreeProps['items'] => {
  return Array.from(data, ([moduleName, chainsInfo]) => ({
    title: (
      <p className={moduleTitle} title={moduleName}>
        {moduleName}
      </p>
    ),
    onOpen: () =>
      onModuleExpand({ moduleName, chains: chainsInfo.map((x) => x.chainId) }),
    items: chainsInfo.map(({ chainId, hash, code, network }) => ({
      title: (
        <Button
          onPress={() => onItemClick({ chainId, moduleName, code, network })}
          isCompact
          endVisual={<MonoExitToApp />}
          title={chainId + (hash ? ` - ${hash}` : '')}
        >
          <>
            {chainId}
            {hash ? ` - ${truncateString(hash, CHARCOUNT_BREAKING_POINT)}` : ''}
          </>
        </Button>
      ),
    })),
  }));
};

const resultsMapToAccordionItems = (data: IResultsProps['data']) => {
  return Array.from(data, ([moduleName, chainsInfo]) => ({
    title: moduleName,
    items: chainsInfo.map((chainInfo) => ({
      title:
        chainInfo.chainId +
        (chainInfo.hash
          ? ` - ${truncateString(chainInfo.hash, CHARCOUNT_BREAKING_POINT)}`
          : ''),
      data: chainInfo,
    })),
  }));
};

const Results = ({
  data,
  onItemClick,
  onModuleExpand,
  filter,
  className,
}: IResultsProps): React.JSX.Element => {
  const items = useMemo(() => {
    let filteredData = data;
    if (filter) {
      filteredData = new Map(
        [...filteredData].filter(([moduleName]) => {
          return moduleName.toLowerCase().includes(filter.toLowerCase());
        }),
      );
    }
    // return resultsMapToTreeItems(filteredData, onItemClick, onModuleExpand);
    return resultsMapToAccordionItems(filteredData);
  }, [data, filter]);

  return (
    <div className={className}>
      {/* <Tree items={items} isOpen /> */}
      <Accordion
        items={items}
        // selectionMode="multiple"
        onSelectionChange={(keys) => {
          if (keys instanceof Set) {
            const [first] = keys;
            const expandedModule = data.get(first as string);

            console.log('onSelectionChange', expandedModule);

            if (expandedModule) {
              onModuleExpand({
                chains: expandedModule.map((x) => x.chainId),
                moduleName: first as string,
              });
            }
          }
        }}
      >
        {(item) => {
          return (
            <AccordionItem
              key={item.title}
              title={item.title}
              hasChildItems={true}
            >
              <ul>
                {item.items.map((child) => {
                  return (
                    <li key={`${item.title}-${child.title}`}>
                      <Button
                        onPress={() =>
                          onItemClick({
                            chainId: child.data.chainId,
                            moduleName: item.title,
                            code: child.data.code,
                            network: child.data.network,
                          })
                        }
                      >
                        {child.title}
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </AccordionItem>
          );
        }}
      </Accordion>
    </div>
  );
};

export default Results;
