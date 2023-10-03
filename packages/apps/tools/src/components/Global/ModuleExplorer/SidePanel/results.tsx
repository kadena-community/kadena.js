import type { ITreeProps } from '@kadena/react-ui';
import { Button, Tree } from '@kadena/react-ui';

import type { IModule } from '..';
import type { getModulesMap } from '../utils';

import { moduleTitle } from './styles.css';

import React, { useMemo } from 'react';

export interface IResultsProps extends React.HTMLAttributes<HTMLDivElement> {
  data: ReturnType<typeof getModulesMap>;
  onItemClick: (result: IModule) => void;
  filter?: string;
}

const resultsMapToTreeItems = (
  data: IResultsProps['data'],
  onItemClick: IResultsProps['onItemClick'],
): ITreeProps['items'] => {
  return Array.from(data, ([moduleName, chains]) => ({
    title: (
      <p className={moduleTitle} title={moduleName}>
        {moduleName}
      </p>
    ),
    items: chains.map((chainId) => ({
      title: (
        <Button
          onClick={() => onItemClick({ chainId, moduleName })}
          variant="compact"
          icon="ExitToApp"
        >
          {chainId}
        </Button>
      ),
    })),
  }));
};

const Results = ({
  data,
  onItemClick,
  filter,
  ...rest
}: IResultsProps): React.JSX.Element => {
  const items = useMemo(() => {
    let filteredData = data;
    if (filter) {
      filteredData = new Map(
        [...filteredData].filter(([moduleName]) => {
          return moduleName.includes(filter);
        }),
      );
    }
    return resultsMapToTreeItems(filteredData, onItemClick);
  }, [data, filter, onItemClick]);

  return (
    <div {...rest}>
      <Tree items={items} isOpen />
    </div>
  );
};

export default Results;
