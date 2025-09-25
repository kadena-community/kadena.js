import { chainOptions } from '../../utils';
import { ActionType, UXActions, UXState } from './type';

export const initialState: UXState = {
  ux: {
    isLoading: false,
    refreshCount: 0,
    time: {
      services: {
        refreshInterval: chainOptions.refreshInterval,
        dedupingInterval: chainOptions.dedupingInterval,
        errorRetryInterval: chainOptions.errorRetryInterval,
      }
    },
    theme: {
      mode: 'system',
    },
    chains: [],
    data: {
      filter: {
        resolution: "DAY",
      }
    },
    chart: {
      isMovingOverChart: false,
      focusedData: {},
    }
  },
};

export const reducer = (state: UXState, action: UXActions): UXState => {
  switch (action.type) {
    case ActionType.SET_LOADING:
      return {
        ...state,
        ux: {
          ...state.ux,
          isLoading: action.payload,
        },
      };
    case ActionType.SET_CHAIN_LOADING: {
      const now = new Date();
      const chain = state.ux.chains?.[action.payload.chainId];

      if (chain) {
        return {
          ...state,
          ux: {
            ...state.ux,
            chains: {
              ...state.ux.chains,
              [action.payload.chainId]: {
                ...chain,
                isLoading: action.payload.isLoading,
                error: action.payload.error || chain.error || null,
                lastUpdateTime: now.toISOString(),
              }
            },
          },
        }
      } else {
        return {
          ...state,
          ux: {
            ...state.ux,
            chains: {
              ...state.ux.chains,
              [action.payload.chainId]: {
                id: action.payload.chainId,
                isLoading: action.payload.isLoading,
                error: action.payload.error || null,
                lastUpdateTime: null,
              }
            },
          },
        }
      }
    }

    case ActionType.SET_LAST_UPDATE_TIME: {
      const now = new Date();
      const chain = state.ux.chains[action.payload];

      if (!chain) return state;

      state.ux.chains[action.payload] = {
        ...chain,
        lastUpdateTime: now.toISOString(),
        isLoading: false,
      };

      return {
        ...state,
        ux: {
          ...state.ux,
        },
      }
    }

    case ActionType.RESET_TIME_SETTINGS:
      return {
        ...state,
        ux: {
          ...state.ux,
          time: initialState.ux.time,
        },
      };
    case ActionType.SET_THEME:
      return {
        ...state,
        ux: {
          ...state.ux,
          theme: {
            mode: action.payload,
          }
        },
      };
    case ActionType.SET_REFRESH_COUNT:
      return {
        ...state,
        ux: {
          ...state.ux,
          refreshCount: (state.ux.refreshCount ?? 0) + 1,
        },
      };
    case ActionType.SET_CHART_FOCUSED_DATA:
      return {
        ...state,
        ux: {
          ...state.ux,
          chart: {
            ...state.ux.chart,
            isMovingOverChart: true,
            focusedData: action.payload,
          }
        },
      };
    case ActionType.UNSET_CHART_FOCUSED_DATA:
      return {
        ...state,
        ux: {
          ...state.ux,
          chart: {
            ...state.ux.chart,
            isMovingOverChart: false,
            focusedData: {},
          }
        },
      };
    default:
      return state;
  }
};
