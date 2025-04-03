import type { ChainId } from '@kadena/types';
import { ethers } from 'ethers';

export const getEVMProvider = (chainId: ChainId): ethers.JsonRpcProvider => {
  return new ethers.JsonRpcProvider(
    `${process.env.NEXT_PUBLIC_RPC_URL}${chainId}`,
  );
};
