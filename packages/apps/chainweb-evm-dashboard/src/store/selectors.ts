"use client";

import { useStore } from 'zustand';
import appStore, { AppStore } from './app';
import { storeChainHandlers } from './chain/handlers';
import { storeUXHandlers } from './ux/handlers';

export const useAppStore = (): AppStore => useStore(appStore);
export const useAppState = <T>(selector: (state: AppStore) => T): T => useStore(appStore, selector);
export const getAppState = () => appStore.getState();
export const subscribeToAppStore = appStore.subscribe;
export const storeDispatch = () => appStore.getState().dispatch;
export const storeHandlers = () => ({
  chains: storeChainHandlers(getAppState, storeDispatch()),
  ux: storeUXHandlers(getAppState, storeDispatch()),
});

export type SubscribeFn<T> = (state: T, previousState?: T) => void;

export const subscribeToAppState = <T>(
  selector: (state: ReturnType<typeof getAppState>) => T,
  fn: SubscribeFn<T>,
  equalityFn: (a: T, b: T) => boolean = (a, b) => a === b
) => {
  return appStore.subscribe(
    selector,
    fn,
    { equalityFn }
  );
};

export const subscribeToEntity = <T>(fn: SubscribeFn<T>, entity: keyof ReturnType<typeof getAppState>) => subscribeToAppState<T>(
  (state) => state[entity] as T,
  fn,
);
