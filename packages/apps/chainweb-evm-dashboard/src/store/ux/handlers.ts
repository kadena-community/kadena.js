import { AppAction, AppStore } from '../app';
import { ActionType, UX } from './type';

const entity = 'ux';

export const storeUXHandlers = (getState: () => AppStore, dispatch: (action: AppAction) => void) => ({
  setLoading: (isLoading: boolean) => {
    return dispatch({ entity, type: ActionType.SET_LOADING, payload: isLoading });
  },
  setChainLoading: (chainId: number, isLoading: boolean, error?: string | null) => {
    return dispatch({ entity, type: ActionType.SET_CHAIN_LOADING, payload: { chainId, isLoading, error } });
  },
  setLastUpdateTime: (chainId: number) => {
    return dispatch({ entity, type: ActionType.SET_LAST_UPDATE_TIME, payload: chainId });
  },
  setThemeMode: (mode: UX['theme']['mode']) => {
    return dispatch({ entity, type: ActionType.SET_THEME, payload: mode });
  },
  resetTimeSettings: () => {
    return dispatch({ entity, type: ActionType.RESET_TIME_SETTINGS });
  },
  setRefreshCount: () => {
    return dispatch({ entity, type: ActionType.SET_REFRESH_COUNT });
  },
  setChartFocusedData: (data: UX['chart']['focusedData']) => {
    return dispatch({ entity, type: ActionType.SET_CHART_FOCUSED_DATA, payload: data });
  },
  unsetChartFocusedData: () => {
    return dispatch({ entity, type: ActionType.UNSET_CHART_FOCUSED_DATA });
  },

  getThemeMode: () => {
    return getState().ux.theme.mode;
  },
  getLastUpdateTime: (chainId: number) => {
    return getState().ux.chains[chainId]?.lastUpdateTime;
  },
  isDarkMode: () => {
    const mode = getState().ux.theme.mode;
    if (mode === 'dark') return true;
    if (mode === 'light') return false;

    if (typeof window !== 'undefined') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  },
});
