import type { FC, PropsWithChildren } from 'react';
import React, { createContext, useContext, useState } from 'react';

interface IBlockInfoContextProps {
  selectedChainId?: number;
  selectedHeight?: number;
  selectedHash?: string;
  handleOpenHeightBlock: (
    height: number,
    chainId: number,
    hash: string,
  ) => void;
}

const defaultContext: IBlockInfoContextProps = {
  selectedChainId: undefined,
  selectedHeight: undefined,
  selectedHash: undefined,
  handleOpenHeightBlock: (height: number, chainId: number, hash: string) => {},
};

export const BlockInfoContext = createContext<
  IBlockInfoContextProps | undefined
>(undefined);

export const BlockInfoProvider: FC<PropsWithChildren> = ({ children }) => {
  const context = useContext(BlockInfoContext);
  const [selectedChainId, setSelectedChainId] = useState<number | undefined>();
  const [selectedHeight, setSelectedHeight] = useState<number | undefined>();
  const [selectedHash, setSelectedHash] = useState<string | undefined>();

  const handleOpenHeightBlock = (
    height: number,
    chainId: number,
    hash: string,
  ) => {
    // if block is already open, close again
    if (
      selectedChainId === chainId &&
      selectedHeight === height &&
      selectedHash === hash
    ) {
      setSelectedChainId(undefined);
      setSelectedHeight(undefined);
      setSelectedHash(undefined);
      return;
    }

    console.log({ chainId });
    setSelectedChainId(chainId);
    setSelectedHeight(height);
    setSelectedHash(hash);
  };

  if (context) return <>{children}</>;
  return (
    <BlockInfoContext.Provider
      value={{
        selectedChainId,
        selectedHeight,
        selectedHash,
        handleOpenHeightBlock,
      }}
    >
      {children}
    </BlockInfoContext.Provider>
  );
};

export const useBlockInfo = () =>
  useContext(BlockInfoContext) ?? defaultContext;
