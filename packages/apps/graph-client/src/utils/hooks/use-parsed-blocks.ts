import type { GetBlocksSubscription } from '@/__generated__/sdk';
import { useCallback, useState } from 'react';

export interface IBlock
  extends Pick<
    NonNullable<GetBlocksSubscription['newBlocks']>[number],
    // TODO: fix transactions from graphql
    // 'transactions' |
    | 'creationTime'
    | 'height'
    | 'chainId'
    | 'hash'
    | 'payload'
    | 'powHash'
    | 'epoch'
    | 'confirmationDepth'
    | 'parentHash'
  > {}
interface IUseParseBlocksReturn {
  allBlocks: Record<number, IBlock[]>;
  addBlocks: (blocks: IBlock[]) => void;
}

export function useParsedBlocks(): IUseParseBlocksReturn {
  const [allBlocks, setAllBlocks] = useState<Record<number, IBlock[]>>({});

  // TODO: maybe this can be useful:
  // https://www.npmjs.com/package/graphql-lodash
  // This way you can change the query to return the data in the format you want
  const addBlocks = useCallback(
    (newBlocks: IBlock[]) => {
      const groupedNewBlocks: Record<number, IBlock[]> = {};
      newBlocks.forEach((block) => {
        groupedNewBlocks[block.height as number]?.length
          ? (groupedNewBlocks[block.height] = [
              ...groupedNewBlocks[block.height],
              block,
            ])
          : (groupedNewBlocks[block.height] = [block]);
      });

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
              (a, b) => b.chainId - a.chainId,
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
