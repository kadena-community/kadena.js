import { ChainwebHeader } from '../chainweb-header';
import { ChainwebRow } from '../chainweb-row';

import type { IBlock } from '@utils/hooks/use-parsed-blocks';
import React from 'react';

interface IChainwebGraphProps {
  blocks: Record<number, IBlock[]>;
}

export const ChainwebGraph = ({ blocks }: IChainwebGraphProps): JSX.Element => {
  return (
    <>
      <ChainwebHeader />
      {Object.entries(blocks)
        .reverse()
        .map(([height, rowBlocks]) => (
          <ChainwebRow
            key={height}
            height={Number(height)}
            blocks={rowBlocks}
          />
        ))}
    </>
  );
};
