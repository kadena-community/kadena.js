import type { FC, PropsWithChildren } from 'react';
import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import type { PressEvent } from 'react-aria';
import type { ISideBarLayoutLocation } from '../../types';

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
  isExpanded: boolean;
  handleToggleExpand: (e: PressEvent) => void;
  handleSetExpanded: (value: boolean) => void;
  handleToggleAsideExpand: (e: PressEvent) => void;
  appContext?: IAppContextProps;
  setAppContext: (context?: IAppContextProps) => void;
  breadCrumbs: ISideBarBreadCrumb[];
  setBreadCrumbs: (value: ISideBarBreadCrumb[]) => void;
  setLocation: (location?: ISideBarLayoutLocation | undefined) => void;
  location?: ISideBarLayoutLocation;
  isActiveUrl: (url?: string) => boolean;
  rightAsideTitle?: string;
  setRightAsideTitle: (value?: string) => void;
  topbannerRef?: HTMLDivElement;
  setTopbannerRef: (value?: HTMLDivElement) => void;
  rightAsideRef?: HTMLDivElement;
  setRightAsideRef: (value?: HTMLDivElement) => void;
  isRightAsideExpanded: boolean;
  setIsRightAsideExpanded: (value: boolean) => void;
  rightAsideOnClose?: () => void;
  setRightAsideOnClose: (value: () => void) => void;
  breadcrumbsRef?: HTMLDivElement;
  setBreadcrumbsRef: (value?: HTMLDivElement) => void;
  headerContextRef?: HTMLDivElement;
  setHeaderContextRef: (value?: HTMLDivElement) => void;
}
export const LayoutContext = createContext<ILayoutContext>({
  isExpanded: true,
  handleToggleExpand: () => {},
  handleSetExpanded: () => {},
  handleToggleAsideExpand: () => {},
  appContext: undefined,
  setAppContext: () => {},
  setBreadCrumbs: () => {},
  breadCrumbs: [],
  setLocation: () => {},
  isActiveUrl: () => {
    return false;
  },
  setRightAsideTitle: () => {},
  isRightAsideExpanded: false,
  setIsRightAsideExpanded: () => {},
  setRightAsideOnClose: () => {},
  topbannerRef: undefined,
  setTopbannerRef: () => {},
  setRightAsideRef: () => {},
  setBreadcrumbsRef: () => {},
  setHeaderContextRef: () => {},
});

export const useLayout = () => useContext(LayoutContext);

export interface ILayoutProvider extends PropsWithChildren {}

export const SideBarLayoutProvider: FC<ILayoutProvider> = ({ children }) => {
  const [rightAsideRef, setRightAsideRefState] = useState<HTMLDivElement>();
  const [topbannerRef, setTopbannerRefState] = useState<HTMLDivElement>();
  const [breadcrumbsRef, setBreadcrumbsRefState] = useState<HTMLDivElement>();
  const [headerContextRef, setHeaderContextRefState] =
    useState<HTMLDivElement>();
  const [isRightAsideExpanded, setIsRightAsideExpanded] = useState(false);
  const rightAsideOnCloseRef = useRef();
  const [rightAsideTitle, setRightAsideTitleState] = useState<
    string | undefined
  >('');
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
      if (isRightAsideExpanded) {
        location?.push(`${location?.url}`);
      }

      setIsRightAsideExpanded((v) => !v);
    },
    [location?.url],
  );

  const handleSetRightAsideExpanded = useCallback(
    (value: boolean) => {
      if (!value) {
        location?.push(`${location?.url}`);
      }
      setIsRightAsideExpanded(value);
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
  const setRightAsideTitle = (value?: string) => {
    setRightAsideTitleState(value);
  };

  const setRightAsideRef = (value?: HTMLDivElement) => {
    setRightAsideRefState(value ? value : undefined);
  };

  const setTopbannerRef = (value?: HTMLDivElement) => {
    setTopbannerRefState(value ? value : undefined);
  };
  const setBreadcrumbsRef = (value?: HTMLDivElement) => {
    setBreadcrumbsRefState(value ? value : undefined);
  };
  const setHeaderContextRef = (value?: HTMLDivElement) => {
    setHeaderContextRefState(value ? value : undefined);
  };
  const setRightAsideOnClose = (value?: any) => {
    rightAsideOnCloseRef.current = value;
  };

  const isActiveUrl = (url?: string) => {
    return !!url && url === location?.url;
  };

  return (
    <LayoutContext.Provider
      value={{
        isExpanded,
        handleToggleExpand,
        handleSetExpanded,
        handleToggleAsideExpand,
        appContext,
        setAppContext,
        breadCrumbs,
        setBreadCrumbs,
        setLocation,
        location,
        isActiveUrl,
        rightAsideTitle,
        setRightAsideTitle,
        topbannerRef,
        setTopbannerRef,
        rightAsideRef,
        setRightAsideRef,
        isRightAsideExpanded,
        setIsRightAsideExpanded: handleSetRightAsideExpanded,
        breadcrumbsRef,
        setBreadcrumbsRef,
        headerContextRef,
        setHeaderContextRef,
        rightAsideOnClose: rightAsideOnCloseRef.current,
        setRightAsideOnClose,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
