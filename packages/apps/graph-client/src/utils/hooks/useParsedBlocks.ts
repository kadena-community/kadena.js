import type { Block } from '../../__generated__/sdk';

import { useCallback, useState } from 'react';

interface IUseParseBlocksReturn {
  allBlocks: Record<number, Block[]>;
  addBlocks: (blocks: Block[]) => void;
}

export function useParsedBlocks(): IUseParseBlocksReturn {
  const [allBlocks, setAllBlocks] = useState<Record<number, Block[]>>({});

  const addBlocks = useCallback(
    (newBlocks: Block[]) => {
      const groupedNewBlocks: Record<number, Block[]> = {};
      newBlocks.forEach((block) =>
        groupedNewBlocks[block.height as number]?.length
          ? (groupedNewBlocks[block.height] = [
              ...groupedNewBlocks[block.height],
              block,
            ])
          : (groupedNewBlocks[block.height] = [block]),
      );

      setAllBlocks((prevBlocks) => {
        const updatedBlocks = { ...prevBlocks };
        Object.entries(groupedNewBlocks).forEach(([height, blocks], index) => {
          const heightNum = Number(height);

          if (updatedBlocks[heightNum]?.length) {
            updatedBlocks[heightNum] = [...updatedBlocks[heightNum], ...blocks];
          } else {
            updatedBlocks[heightNum] = [...blocks];
          }

          if (index === blocks.length - 1) {
            updatedBlocks[heightNum] = [...updatedBlocks[heightNum]].sort(
              (a, b) => b.chainid - a.chainid,
            );
          }
        });

        return updatedBlocks;
      });
    },
    [setAllBlocks],
  );

  return { addBlocks, allBlocks };
}
