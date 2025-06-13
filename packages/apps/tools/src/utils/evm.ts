import type { BaseError } from 'viem';
import {
  ContractFunctionRevertedError,
  createPublicClient,
  defineChain,
  http,
} from 'viem';

export type EVMChainId = '20' | '21' | '22' | '23' | '24';
export const EVMCHAINS: EVMChainId[] = ['20', '21', '22', '23', '24'];

const STARTBLOCKCHAINWEB = process.env.NEXT_PUBLIC_STARTBLOCKCHAINWEB;
const STARTCHAIN_ID = process.env.NEXT_PUBLIC_STARTCHAIN_ID ?? '0';
const createBlockChainId = (chainId: EVMChainId): number => {
  if (!STARTBLOCKCHAINWEB) {
    console.error('STARTBLOCKCHAINWEB env variable is not set');
    throw new Error('STARTBLOCKCHAINWEB env variable is not set');
  }
  return (
    parseInt(STARTBLOCKCHAINWEB, 10) +
    parseInt(chainId, 10) -
    parseInt(STARTCHAIN_ID, 10)
  );
};

export const createServerUrl = (chainId: EVMChainId, isServer?: boolean) => {
  if (isServer) {
    return `${process.env.NEXT_PUBLIC_EVMRPC_URL}${chainId}/evm/rpc`;
  }
  return `/api/eth/${chainId}`;
};

export const getChainwebEVMChain = (
  chainId: EVMChainId,
  isServer?: boolean,
) => {
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
      default: {
        http: [createServerUrl(chainId, isServer)],
      },
      public: {
        http: [createServerUrl(chainId, isServer)],
      },
    },
  });
};

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

export const getPublicClient = (chainId: EVMChainId, isServer?: boolean) => {
  return createPublicClient({
    chain: getChainwebEVMChain(chainId, isServer),
    transport: http(createServerUrl(chainId, isServer)),
  });
};
