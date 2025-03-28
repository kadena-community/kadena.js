import type { FC, PropsWithChildren } from 'react';
import React, { createContext, useContext, useState } from 'react';

export interface ILayoutContext {
  headerContentRef?: HTMLDivElement | null;
  setHeaderContentRef: (value?: HTMLDivElement | null) => void;
  headerAsideRef?: HTMLDivElement | null;
  setHeaderAsideRef: (value?: HTMLDivElement | null) => void;
  footerContentRef?: HTMLDivElement | null;
  setFooterContentRef: (value?: HTMLDivElement | null) => void;
  topbannerRef?: HTMLDivElement | null;
  setTopbannerRef: (value?: HTMLDivElement | null) => void;
}
export const LayoutContext = createContext<ILayoutContext>({
  setHeaderContentRef: () => {},
  setHeaderAsideRef: () => {},
  setFooterContentRef: () => {},
  setTopbannerRef: () => {},
});

export const useLayout = () => useContext(LayoutContext);

export interface ILayoutProvider extends PropsWithChildren {}

export const FocussedLayoutProvider: FC<ILayoutProvider> = ({ children }) => {
  const [headerContentRef, setHeaderContentRefState] =
    useState<HTMLDivElement | null>(null);
  const [headerAsideRef, setHeaderAsideRefState] =
    useState<HTMLDivElement | null>(null);
  const [footerContentRef, setFooterContentState] =
    useState<HTMLDivElement | null>(null);
  const [topbannerRef, setTopbannerRefState] = useState<HTMLDivElement | null>(
    null,
  );

  const setHeaderContentRef = (value?: HTMLDivElement | null) => {
    setHeaderContentRefState(value ? value : null);
  };
  const setHeaderAsideRef = (value?: HTMLDivElement | null) => {
    setHeaderAsideRefState(value ? value : null);
  };
  const setFooterContentRef = (value?: HTMLDivElement | null) => {
    setFooterContentState(value ? value : null);
  };

  const setTopbannerRef = (value?: HTMLDivElement | null) => {
    setTopbannerRefState(value ? value : null);
  };

  return (
    <LayoutContext.Provider
      value={{
        headerContentRef,
        setHeaderContentRef,
        headerAsideRef,
        setHeaderAsideRef,
        footerContentRef,
        setFooterContentRef,
        topbannerRef,
        setTopbannerRef,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
