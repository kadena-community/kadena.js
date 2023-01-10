import type { Block } from '../../__generated__/sdk';

import { ChainwebHeader } from './../chainweb-header';
import { ChainwebRow } from './../chainweb-row';

import React from 'react';

interface IChainwebGraphProps {
  blocks: Record<number, Block[]>;
}

export function ChainwebGraph({ blocks }: IChainwebGraphProps): JSX.Element {
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
}
