import type { DevOption } from '@/constants/kadena';
import { useDidUpdateEffect } from '@/hooks';
import { getItem, setItem } from '@/utils/persist';
import type { PropsWithChildren } from 'react';
import React, { createContext, useContext, useLayoutEffect, useState } from 'react';

interface INetworkState {
  devOption: DevOption;
  setDevOption(option: DevOption): void;
}

const AppContext = createContext<INetworkState>({
  devOption: 'BASIC',
  setDevOption: () => {},
});

const StorageKeys: Record<'DEV_OPTION', string> = {
  DEV_OPTION: 'devOption',
};

const useAppContext = (): INetworkState => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error('Please use AppContextProvider in parent component');
  }

  return context;
};

const AppContextProvider = (props: PropsWithChildren): JSX.Element => {
  const [devOption, setDevOption] = useState<DevOption>('BASIC');

  useLayoutEffect(() => {
    const initialDevOption = getItem(StorageKeys.DEV_OPTION) as DevOption;
    if (initialDevOption) {
      setDevOption(initialDevOption);
    }
  }, []);

  useDidUpdateEffect(() => {
    setItem(StorageKeys.DEV_OPTION, devOption);
  }, [devOption]);

  return (
    <AppContext.Provider
      value={{
        devOption,
        setDevOption,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider, useAppContext };
