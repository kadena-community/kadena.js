import type { IBlock } from '../utils/hooks/use-parsed-blocks';

import type { ReactElement } from 'react';
import React, { createContext, useContext, useState } from 'react';

interface IChainTree {
  [chain: string]: Record<string, IBlock>;
}

interface IChainTreeContext {
  chainTree: IChainTree;
  addBlockToChain: (block: IBlock) => void;
}

const ChainTreeContext = createContext<IChainTreeContext | undefined>(
  undefined,
);

export function addBlockToChainTree(
  block: IBlock,
  chainTree: IChainTree,
): IChainTree {
  let currentBlock = block;

  //Check if chain index exists, if not create it
  if (chainTree[currentBlock.chainId] === undefined) {
    chainTree[currentBlock.chainId] = {};
  }

  //Add block to chain
  chainTree[currentBlock.chainId][currentBlock.hash] = currentBlock;

  //Check if parent block exists, if it does increment confirmation depth
  while (
    currentBlock.parentHash &&
    chainTree[currentBlock.chainId][currentBlock.parentHash]
  ) {
    const childsConfirmationDepth = currentBlock.confirmationDepth;

    //set current block to parent block
    currentBlock = {
      ...chainTree[currentBlock.chainId][currentBlock.parentHash],
    };

    //before incrementing depth check if it is already 6
    if (currentBlock.confirmationDepth < 6) {
      currentBlock.confirmationDepth = childsConfirmationDepth + 1;
    } else {
      break;
    }

    //set the updated block in the chain
    chainTree[currentBlock.chainId][currentBlock.hash] = currentBlock;
  }

  return chainTree;
}

export const ChainTreeContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}): ReactElement => {
  const [chainTree, setChainTree] = useState<IChainTree>({});

  const addBlockToChain = (block: IBlock): void => {
    setChainTree((prevChainTree) => addBlockToChainTree(block, prevChainTree));
  };

  return (
    <ChainTreeContext.Provider value={{ chainTree, addBlockToChain }}>
      {children}
    </ChainTreeContext.Provider>
  );
};

export function useChainTree(): IChainTreeContext {
  const context = useContext(ChainTreeContext);
  if (!context) {
    throw new Error('useChainTree must be used within a ChainTreeProvider');
  }
  return context;
}
