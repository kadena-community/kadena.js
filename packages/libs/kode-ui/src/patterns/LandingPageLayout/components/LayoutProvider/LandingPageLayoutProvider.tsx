import type { FC, PropsWithChildren } from 'react';
import React, { createContext, useContext, useState } from 'react';
import { LayoutContext as FocussedLayoutContext } from './../../../FocussedLayout/components/LayoutProvider/FocussedLayoutProvider';

export interface ILayoutContext {
  footerContentRef?: HTMLDivElement | null;
  setFooterContentRef: (value?: HTMLDivElement | null) => void;
}
export const LayoutContext = createContext<ILayoutContext>({
  setFooterContentRef: () => {},
});

export const useLayout = () => {
  const layoutContext = useContext(LayoutContext);
  const focussedLayoutContext = useContext(FocussedLayoutContext);

  return { ...layoutContext, ...focussedLayoutContext };
};

export interface ILayoutProvider extends PropsWithChildren {}

export const LandingPageLayoutProvider: FC<ILayoutProvider> = ({
  children,
}) => {
  const [footerContentRef, setFooterContentRefState] =
    useState<HTMLDivElement | null>(null);

  const setFooterContentRef = (value?: HTMLDivElement | null) => {
    setFooterContentRefState(value ? value : null);
  };

  return (
    <LayoutContext.Provider
      value={{
        footerContentRef,
        setFooterContentRef,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
