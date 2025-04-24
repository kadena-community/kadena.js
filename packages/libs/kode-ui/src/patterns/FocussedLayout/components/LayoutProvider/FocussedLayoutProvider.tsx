import type { FC, PropsWithChildren } from 'react';
import React, { createContext, useContext, useState } from 'react';

export interface ILayoutContext {
  headerContentRef?: HTMLDivElement;
  setHeaderContentRef: (value?: HTMLDivElement) => void;
  headerAsideRef?: HTMLDivElement;
  setHeaderAsideRef: (value?: HTMLDivElement) => void;
  footerContentRef?: HTMLDivElement;
  setFooterContentRef: (value?: HTMLDivElement) => void;
  topbannerRef?: HTMLDivElement;
  setTopbannerRef: (value?: HTMLDivElement) => void;
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
    useState<HTMLDivElement>();
  const [headerAsideRef, setHeaderAsideRefState] = useState<HTMLDivElement>();
  const [footerContentRef, setFooterContentState] = useState<HTMLDivElement>();
  const [topbannerRef, setTopbannerRefState] = useState<HTMLDivElement>();

  const setHeaderContentRef = (value?: HTMLDivElement) => {
    setHeaderContentRefState(value ? value : undefined);
  };
  const setHeaderAsideRef = (value?: HTMLDivElement) => {
    setHeaderAsideRefState(value ? value : undefined);
  };
  const setFooterContentRef = (value?: HTMLDivElement) => {
    setFooterContentState(value ? value : undefined);
  };

  const setTopbannerRef = (value?: HTMLDivElement) => {
    setTopbannerRefState(value ? value : undefined);
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
