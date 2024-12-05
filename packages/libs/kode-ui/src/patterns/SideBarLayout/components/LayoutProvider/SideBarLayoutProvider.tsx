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
  rightAsideRef?: HTMLDivElement | null;
  setRightAsideRef: (value?: HTMLDivElement | null) => void;
  isRightAsideExpanded: boolean;
  setIsRightAsideExpanded: (value: boolean) => void;
  rightAsideOnClose?: () => void;
  setRightAsideOnClose: (value: () => void) => void;
  breadcrumbsRef?: HTMLDivElement | null;
  setBreadcrumbsRef: (value?: HTMLDivElement | null) => void;
  headerContextRef?: HTMLDivElement | null;
  setHeaderContextRef: (value?: HTMLDivElement | null) => void;
}
export const LayoutContext = createContext<ILayoutContext>({
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
  setRightAsideTitle: () => {},
  isRightAsideExpanded: false,
  setIsRightAsideExpanded: () => {},
  setRightAsideOnClose: () => {},
});

export const useLayout = () => useContext(LayoutContext);

export interface ILayoutProvider extends PropsWithChildren {}

export const SideBarLayoutProvider: FC<ILayoutProvider> = ({ children }) => {
  const [rightAsideRef, setRightAsideRefState] =
    useState<HTMLDivElement | null>(null);

  const [breadcrumbsRef, setBreadcrumbsRefState] =
    useState<HTMLDivElement | null>(null);
  const [headerContextRef, setHeaderContextRefState] =
    useState<HTMLDivElement | null>(null);
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

  const setRightAsideRef = (value?: HTMLDivElement | null) => {
    setRightAsideRefState(value ? value : null);
  };

  const setBreadcrumbsRef = (value?: HTMLDivElement | null) => {
    setBreadcrumbsRefState(value ? value : null);
  };
  const setHeaderContextRef = (value?: HTMLDivElement | null) => {
    setHeaderContextRefState(value ? value : null);
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
