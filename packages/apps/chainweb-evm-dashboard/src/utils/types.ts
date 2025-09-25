import useSWR, { KeyedMutator } from "swr";
import { ResolvedTypes, ServiceId } from "../store/chain/type";

export type ServiceItem<E = { id: ServiceId }> = {
  url: string;
  isStatsLine?: boolean;
} & E;

export type GraphOptions = {
  strokeColor?: string;
  strokeWidth?: number;
  fillColor?: string;
  margins?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  background?: {
    color?: string;
    isGradient?: boolean;
    from?: string;
    to?: string;
    direction?: string;
  };
}

export type LineGraphOptions = {
    ticks?: number;
    margins?: GraphOptions['margins'];
    color?: {
      line?: string;
      fill?: string;
    };
  };

export type SWRResponseMap<ID = { id: ServiceId | 'counters' }, R = ResolvedTypes> = {
  [key: string]: ID
    & { type: 'stats-line' | 'stats-overall'; }
    & ReturnType<typeof useSWR<R>>
    & { mutate: KeyedMutator<R> };
}
