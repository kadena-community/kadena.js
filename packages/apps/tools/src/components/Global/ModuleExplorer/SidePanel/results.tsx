import type { ChainwebChainId } from '@kadena/chainweb-node-client';
import { MonoExitToApp } from '@kadena/react-icons/system';
import type { ITreeProps } from '@kadena/react-ui';
import { Button, Tree } from '@kadena/react-ui';
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
    items: chainsInfo.map(({ chainId, hash }) => ({
      title: (
        <Button
          onPress={() => onItemClick({ chainId, moduleName })}
          isCompact
          icon={<MonoExitToApp />}
          title={chainId + (hash ? ` - ${hash}` : '')}
        >
          {chainId}
          {hash ? ` - ${truncateString(hash, CHARCOUNT_BREAKING_POINT)}` : ''}
        </Button>
      ),
    })),
  }));
};

const Results = ({
  data,
  onItemClick,
  onModuleExpand,
  filter,
  ...rest
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
    return resultsMapToTreeItems(filteredData, onItemClick, onModuleExpand);
  }, [data, filter, onItemClick, onModuleExpand]);

  return (
    <div {...rest}>
      <Tree items={items} isOpen />
    </div>
  );
};

export default Results;
