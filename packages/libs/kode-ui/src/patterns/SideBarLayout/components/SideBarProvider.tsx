import type { FC, PropsWithChildren } from 'react';
import React, { createContext, useCallback, useContext, useState } from 'react';
import type { PressEvent } from 'react-aria';

export interface IAppContextProps {
  visual: React.ReactElement;
  label: string;
  onPress?: () => void;
  href?: string;
}

export interface ISideBarBreadCrumb {
  label: string;
  url: string;
  visual?: React.ReactElement;
}
export interface ISideBarContext {
  isExpanded: boolean;
  handleToggleExpand: (e: PressEvent) => void;
  handleSetExpanded: (value: boolean) => void;
  appContext?: IAppContextProps;
  setAppContext: (context?: IAppContextProps) => void;
  breadCrumbs: ISideBarBreadCrumb[];
  setBreadCrumbs: (value: ISideBarBreadCrumb[]) => void;
  setActiveUrl: (value?: string) => void;
  activeUrl?: string;
  isActiveUrl: (url?: string) => boolean;
}
export const SideBarContext = createContext<ISideBarContext>({
  isExpanded: true,
  handleToggleExpand: () => {},
  handleSetExpanded: () => {},
  appContext: undefined,
  setAppContext: () => {},
  setBreadCrumbs: () => {},
  breadCrumbs: [],
  setActiveUrl: () => {},
  isActiveUrl: () => {},
});
export const useSideBar = (): ISideBarContext => useContext(SideBarContext);

export interface ISideBarProvider extends PropsWithChildren {}

export const SideBarProvider: FC<ISideBarProvider> = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeUrl, setActiveUrlState] = useState<string | undefined>();
  const [appContext, setAppContextState] = useState<
    IAppContextProps | undefined
  >();
  const [breadCrumbs, setBreadCrumbsState] = useState<ISideBarBreadCrumb[]>([]);

  const handleToggleExpand = useCallback((e: PressEvent) => {
    setIsExpanded((v) => !v);
  }, []);
  const handleSetExpanded = useCallback((value: boolean) => {
    setIsExpanded(value);
  }, []);

  const setAppContext = useCallback((context?: IAppContextProps) => {
    setAppContextState(context);
  }, []);

  const setBreadCrumbs = (value: ISideBarBreadCrumb[]) => {
    setBreadCrumbsState(value);
  };
  const setActiveUrl = (value?: string) => {
    setActiveUrlState(value);
  };

  const isActiveUrl = (url?: string) => {
    return !!url && url === activeUrl;
  };

  return (
    <SideBarContext.Provider
      value={{
        isExpanded,
        handleToggleExpand,
        handleSetExpanded,
        appContext,
        setAppContext,
        breadCrumbs,
        setBreadCrumbs,
        setActiveUrl,
        activeUrl,
        isActiveUrl,
      }}
    >
      {children}
    </SideBarContext.Provider>
  );
};
