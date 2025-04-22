import type { ChainId } from '@kadena/types';
import type { BaseError } from 'viem';
import { ContractFunctionRevertedError, defineChain } from 'viem';

const STARTBLOCKCHAINWEB = process.env.NEXT_PUBLIC_STARTBLOCKCHAINWEB;

const createBlockChainId = (chainId: ChainId): number => {
  if (!STARTBLOCKCHAINWEB) {
    console.error('STARTBLOCKCHAINWEB env variable is not set');
    throw new Error('STARTBLOCKCHAINWEB env variable is not set');
  }
  return parseInt(STARTBLOCKCHAINWEB, 10) + parseInt(chainId, 10);
};

export function createChainwebChain(chainId: ChainId) {
  console.log(11111, createBlockChainId(chainId));
  return defineChain({
    id: createBlockChainId(chainId),
    name: 'Kadena Chainweb EVM',
    network: `kadena_${createBlockChainId(chainId)}`,
    nativeCurrency: {
      decimals: 18,
      name: 'KDA',
      symbol: 'KDA',
    },
    rpcUrls: {
      default: { http: [process.env.NEXT_PUBLIC_EVMRPC_URL + chainId] },
      public: { http: [process.env.NEXT_PUBLIC_EVMRPC_URL + chainId] },
    },
  });
}

export const getChainwebEVMChain = (chainId: ChainId) =>
  createChainwebChain(chainId);

export const formatErrorMessage = (err: BaseError): string => {
  const revertError = err.walk(
    (err) => err instanceof ContractFunctionRevertedError,
  );
  if (revertError instanceof ContractFunctionRevertedError) {
    const errorName = revertError.data?.errorName ?? '';

    switch (errorName) {
      case 'CooldownPeriodNotElapsed': {
        const [, lastClaimed, cooldownPeriod] = revertError.data?.args ?? [];
        const nextAvailable = new Date(Number(lastClaimed) * 1000);
        const hours = Number(cooldownPeriod) / 3600;
        return `Please wait until ${nextAvailable.toLocaleString()}. Cooldown period is ${hours} hours.`;
      }
      case 'InsufficientNativeTokenBalance':
        return 'Faucet is out of funds';
      case 'InvalidRecipient':
        return 'Invalid recipient address';
      case 'TransferNativeTokenFailed':
        return 'Transfer failed';
      default:
        return 'Transaction failed';
    }
  }
  return err.shortMessage || 'Transaction failed';
};
