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
  isAsideExpanded: boolean;
  isExpanded: boolean;
  handleToggleExpand: (e: PressEvent) => void;
  handleSetExpanded: (value: boolean) => void;
  handleToggleAsideExpand: (e: PressEvent) => void;
  handleSetAsideExpanded: (value: boolean) => void;
  appContext?: IAppContextProps;
  setAppContext: (context?: IAppContextProps) => void;
  breadCrumbs: ISideBarBreadCrumb[];
  setBreadCrumbs: (value: ISideBarBreadCrumb[]) => void;
  setActiveUrl: (value?: string) => void;
  activeUrl?: string;
  isActiveUrl: (url?: string) => boolean;
}
export const SideBarContext = createContext<ISideBarContext>({
  isAsideExpanded: false,
  isExpanded: true,
  handleToggleExpand: () => {},
  handleSetExpanded: () => {},
  handleToggleAsideExpand: () => {},
  handleSetAsidExpanded: () => {},
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
  const [isAsideExpanded, setIsAsideExpanded] = useState(false);
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

  const handleToggleAsideExpand = useCallback((e: PressEvent) => {
    setIsAsideExpanded((v) => !v);
  }, []);
  const handleSetAsideExpanded = useCallback((value: boolean) => {
    setIsAsideExpanded(value);
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
        isAsideExpanded,
        isExpanded,
        handleToggleExpand,
        handleSetExpanded,
        handleToggleAsideExpand,
        handleSetAsideExpanded,
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
