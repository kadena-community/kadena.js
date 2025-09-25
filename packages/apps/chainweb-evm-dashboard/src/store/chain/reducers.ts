import { AppState } from '../app';
import { processStats, processStatsLine } from './functions';
import { ActionType, ChainActions, Chains } from './type';

export const initialState: Chains = {
  chains: [
    {
      id: 20,
      metaData: {
        name: 'Chain 20',
        color: '#3B82F6',
        endpoint: {
          base: 'https://chain-${chainId}.evm-testnet-blockscout.chainweb.com',
          stats: 'https://chain-${chainId}.evm-testnet-blockscout.chainweb.com/stats-service',
        },
      },
    },
    {
      id: 21,
      metaData: {
        name: 'Chain 21',
        color: '#10B981',
        endpoint: {
          base: 'https://chain-${chainId}.evm-testnet-blockscout.chainweb.com',
          stats: 'https://chain-${chainId}.evm-testnet-blockscout.chainweb.com/stats-service',
        },
      },
    },
    {
      id: 22,
      metaData: {
        name: 'Chain 22',
        color: '#F59E0B',
        endpoint: {
          base: 'https://chain-${chainId}.evm-testnet-blockscout.chainweb.com',
          stats: 'https://chain-${chainId}.evm-testnet-blockscout.chainweb.com/stats-service',
        },
      },
    },
    {
      id: 23,
      metaData: {
        name: 'Chain 23',
        color: '#EF4444',
        endpoint: {
          base: 'https://chain-${chainId}.evm-testnet-blockscout.chainweb.com',
          stats: 'https://chain-${chainId}.evm-testnet-blockscout.chainweb.com/stats-service',
        },
      },
    },
    {
      id: 24,
      metaData: {
        name: 'Chain 24',
        color: '#8B5CF6',
        endpoint: {
          base: 'https://chain-${chainId}.evm-testnet-blockscout.chainweb.com',
          stats: 'https://chain-${chainId}.evm-testnet-blockscout.chainweb.com/stats-service',
        },
      },
    },
  ],
};

export const reducer = (state: AppState, action: ChainActions): Partial<AppState> => {
  switch (action.type) {
    case ActionType.LOAD_CHAIN_DATA:
      return state;
    case ActionType.SET_CHAIN_DATA:
      return {
        ...state,
        chains: state.chains.map(chain =>
          chain.id === action.payload.id
            ? {
                ...chain,
                metaData: action.payload.metaData
                  ? { ...chain.metaData, ...action.payload.metaData }
                  : chain.metaData,
                stats: action.payload.stats ? processStats(action.payload.stats) : chain.stats,
                graphs: action.payload.graphs ? processStatsLine(action.payload.graphs) : chain.graphs,
              }
            : chain
        )
      };
    case ActionType.RESET_CHAINS_DATA:
      return {
        ...state,
        chains: initialState.chains,
      };
    case ActionType.RESET_CHAIN_DATA:
      return {
        ...state,
        chains: state.chains.map(chain =>
          chain.id === action.payload.chainId
            ? initialState.chains.find(c => c.id === chain.id) || chain
            : chain
        ),
      };
    default:
      return state;
  }
};
