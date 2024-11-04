import type { FC, PropsWithChildren } from 'react';
import React, { createContext, useCallback, useContext, useState } from 'react';
import type { PressEvent } from 'react-aria';
import type { ISideBarLayoutLocation } from '../types';

export interface IAppContextProps {
  visual: React.ReactElement;
  label: string;
  component?: any;
  onPress?: () => void;
  href?: string;
}

export interface ISideBarBreadCrumb {
  label: string;
  url: string;
  visual?: React.ReactElement;
}
export interface ILayoutContext {
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
  setLocation: (location?: ISideBarLayoutLocation | undefined) => void;
  location?: ISideBarLayoutLocation;
  isActiveUrl: (url?: string) => boolean;
}
export const LayoutContext = createContext<ILayoutContext>({
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
  setLocation: () => {},
  isActiveUrl: () => {},
});

export interface IuseLayoutProps extends ILayoutContext {
  initPage: (props: Pick<ILayoutContext, 'appContext' | 'breadCrumbs'>) => void;
}

export const useLayout = (): IuseLayoutProps => {
  const context = useContext(LayoutContext);

  const initPage = useCallback(
    ({
      appContext,
      breadCrumbs,
    }: Pick<ILayoutContext, 'appContext' | 'breadCrumbs'>) => {
      context.setBreadCrumbs(breadCrumbs ?? []);
      context.setAppContext(appContext);
    },
    [],
  );

  return { ...context, initPage };
};

export interface ILayoutProvider extends PropsWithChildren {}

export const LayoutProvider: FC<ILayoutProvider> = ({ children }) => {
  const [isAsideExpanded, setIsAsideExpanded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [location, setLocationState] = useState<
    ISideBarLayoutLocation | undefined
  >();
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

  const handleToggleAsideExpand = useCallback(
    (e: PressEvent) => {
      if (isAsideExpanded) {
        location?.push(`${location?.url}`);
      }

      setIsAsideExpanded((v) => !v);
    },
    [location?.url],
  );

  const handleSetAsideExpanded = useCallback(
    (value: boolean) => {
      if (!value) {
        location?.push(`${location?.url}`);
      }
      setIsAsideExpanded(value);
    },
    [location?.url],
  );

  const setAppContext = useCallback((context?: IAppContextProps) => {
    setAppContextState(context);
  }, []);

  const setBreadCrumbs = (value: ISideBarBreadCrumb[]) => {
    setBreadCrumbsState(value);
  };
  const setLocation = (value?: ISideBarLayoutLocation | undefined) => {
    setLocationState(value);
  };

  const isActiveUrl = (url?: string) => {
    return !!url && url === location?.url;
  };

  return (
    <LayoutContext.Provider
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
        setLocation,
        location,
        isActiveUrl,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
