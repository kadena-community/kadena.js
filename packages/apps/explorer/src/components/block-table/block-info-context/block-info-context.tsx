import type { IBlockData } from '@/services/block';
import type { FC, PropsWithChildren } from 'react';
import React, { createContext, useContext, useState } from 'react';

interface IBlockInfoContextProps {
  selectedChainId?: number;
  selectedHeight?: IBlockData;
  selectedHash?: string;
  handleOpenHeightBlock: (chainId: number, height: IBlockData) => void;
}

const defaultContext: IBlockInfoContextProps = {
  selectedChainId: undefined,
  selectedHeight: undefined,
  handleOpenHeightBlock: (chainId: number, height: IBlockData) => {},
};

export const BlockInfoContext = createContext<
  IBlockInfoContextProps | undefined
>(undefined);

export const BlockInfoProvider: FC<PropsWithChildren> = ({ children }) => {
  const context = useContext(BlockInfoContext);
  const [selectedChainId, setSelectedChainId] = useState<number | undefined>();
  const [selectedHeight, setSelectedHeight] = useState<
    IBlockData | undefined
  >();

  const handleOpenHeightBlock = (chainId: number, height: IBlockData): void => {
    // if block is already open, close again

    if (
      selectedChainId === chainId &&
      selectedHeight?.height === height?.height
    ) {
      setSelectedChainId(undefined);
      setSelectedHeight(undefined);
      return;
    }

    setSelectedChainId(chainId);
    setSelectedHeight(height);
  };

  if (context) return <>{children}</>;
  return (
    <BlockInfoContext.Provider
      value={{
        selectedChainId,
        selectedHeight,
        handleOpenHeightBlock,
      }}
    >
      {children}
    </BlockInfoContext.Provider>
  );
};

export const useBlockInfo = () =>
  useContext(BlockInfoContext) ?? defaultContext;
