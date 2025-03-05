import type { FC, PropsWithChildren } from 'react';
import React, { createContext, useContext, useState } from 'react';

export interface ILayoutContext {
  headerContextRef?: HTMLDivElement | null;
  setHeaderContextRef: (value?: HTMLDivElement | null) => void;
}
export const LayoutContext = createContext<ILayoutContext>({
  setHeaderContextRef: () => {},
});

export const useLayout = () => useContext(LayoutContext);

export interface ILayoutProvider extends PropsWithChildren {}

export const FocussedLayoutProvider: FC<ILayoutProvider> = ({ children }) => {
  const [headerContextRef, setHeaderContextRefState] =
    useState<HTMLDivElement | null>(null);

  const setHeaderContextRef = (value?: HTMLDivElement | null) => {
    setHeaderContextRefState(value ? value : null);
  };

  return (
    <LayoutContext.Provider
      value={{
        headerContextRef,
        setHeaderContextRef,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
