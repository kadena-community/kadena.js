import type { FC, PropsWithChildren } from 'react';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
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
  asideTitle?: string;
  setAsideTitle: (value?: string) => void;
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
  setAsideTitle: () => {},
});

export interface IuseLayoutProps extends ILayoutContext {
  initPage: (props: Pick<ILayoutContext, 'appContext' | 'breadCrumbs'>) => void;
}

export const useLayout = (
  props?: Pick<ILayoutContext, 'appContext' | 'breadCrumbs'>,
): IuseLayoutProps => {
  const context = useContext(LayoutContext);

  useEffect(() => {
    if (!props) return;

    if (props.appContext?.label !== context.appContext?.label) {
      context.setAppContext(props.appContext);
    }

    //check if the content of the breadcrumbs has changed
    const breadCrumbsHasChanged = props.breadCrumbs.reduce((acc, val, idx) => {
      const oldVal = context.breadCrumbs[idx];
      if (val.url !== oldVal?.url) return true;

      return acc;
    }, false);

    if (
      props.breadCrumbs.length !== context.breadCrumbs.length ||
      breadCrumbsHasChanged
    ) {
      context.setBreadCrumbs(props.breadCrumbs);
    }
  }, [props?.appContext, props?.breadCrumbs]);

  return { ...context };
};

export interface ILayoutProvider extends PropsWithChildren {}

export const LayoutProvider: FC<ILayoutProvider> = ({ children }) => {
  const [isAsideExpanded, setIsAsideExpanded] = useState(false);
  const [asideTitle, setAsideTitleState] = useState<string | undefined>('');
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
  const setAsideTitle = (value?: string) => {
    setAsideTitleState(value);
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
        asideTitle,
        setAsideTitle,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
