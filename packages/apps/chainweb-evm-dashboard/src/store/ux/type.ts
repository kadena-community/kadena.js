import { SWRConfiguration } from "swr/_internal";
import { storeUXHandlers } from "./handlers";
import { Resolution } from "../chain/type";

export type EventMouseData = {
  mouseX: number;
  pageX: number;
  pageY: number;
}

export type UX = {
  isLoading: boolean;
  refreshCount: number;
  time: {
    services: Partial<SWRConfiguration>
  };
  theme: {
    mode: 'light' | 'dark' | 'system';
  };
  chains: Record<number, {
    id: number;
    isLoading: boolean;
    error: string | null;
    lastUpdateTime: string | null;
  }>;
  data: {
    filter: {
      resolution: Resolution; // default "DAY"
      from?: string; // ISO date string (YYYY-MM-DD)
      to?: string;   // ISO date string (YYYY-MM-DD)
    }
  },
  chart: {
    isMovingOverChart: boolean;
    focusedData: {
      point?: {
        index: number;
        date: string;
        value: number | string;
        chainId: number | undefined;
        event: EventMouseData;
      };
    };
  }
}

export type UXState = {
  ux: UX;
}

export enum ActionType {
  SET_THEME = 'SET_THEME',
  SET_LOADING = 'SET_LOADING',
  SET_CHAIN_LOADING = 'SET_CHAIN_LOADING',
  SET_LAST_UPDATE_TIME = 'SET_LAST_UPDATE_TIME',
  RESET_TIME_SETTINGS = 'RESET_TIME_SETTINGS',
  SET_REFRESH_COUNT = 'SET_REFRESH_COUNT',
  SET_CHART_FOCUSED_DATA = 'SET_CHART_FOCUSED_DATA',
  UNSET_CHART_FOCUSED_DATA = 'UNSET_CHART_FOCUSED_DATA',
}

export type UXActions = {
  entity: 'ux';
} & (
  | { type: ActionType.SET_LOADING; payload: boolean; }
  | { type: ActionType.SET_CHAIN_LOADING; payload: { chainId: number; isLoading: boolean; error?: string | null }; }
  | { type: ActionType.SET_LAST_UPDATE_TIME; payload: number; }
  | { type: ActionType.SET_THEME; payload: 'light' | 'dark' | 'system'; }
  | { type: ActionType.RESET_TIME_SETTINGS; }
  | { type: ActionType.SET_REFRESH_COUNT; }
  | { type: ActionType.SET_CHART_FOCUSED_DATA; payload: UX['chart']['focusedData']; }
  | { type: ActionType.UNSET_CHART_FOCUSED_DATA; }
);

export type StoreHandlers = ReturnType<typeof storeUXHandlers>;
