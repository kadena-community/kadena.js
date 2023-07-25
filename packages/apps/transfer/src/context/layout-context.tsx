import { ISidebarToolbarItem } from '@/types/Layout';
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

interface ILayoutContext {
  toolbar: ISidebarToolbarItem[];
  setToolbar: (toolbar: ISidebarToolbarItem[]) => void;
  isMenuOpen: boolean;
  activeMenuIndex?: number;
  setActiveMenuIndex: (index?: number) => void;
  activeMenu?: ISidebarToolbarItem;
  resetLayout: () => void;
}

const LayoutContext = createContext<ILayoutContext>({
  toolbar: [],
  setToolbar: () => {},
  isMenuOpen: false,
  setActiveMenuIndex: () => {},
  activeMenu: undefined,
  resetLayout: () => {},
});

const useLayoutContext = (): ILayoutContext => {
  const context = useContext(LayoutContext);

  if (context === undefined) {
    throw new Error('Please use LayoutContextProvider in parent component');
  }

  return context;
};

export const useToolbar = (toolbar: ISidebarToolbarItem[]): void => {
  const { setToolbar, resetLayout } = useLayoutContext();
  useEffect(() => {
    setToolbar(toolbar);

    return resetLayout;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

const LayoutContextProvider = (props: PropsWithChildren): JSX.Element => {
  const [toolbar, setToolbar] = useState<ISidebarToolbarItem[]>([]);
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | undefined>();
  const isMenuOpen = Number.isInteger(activeMenuIndex);

  const resetLayout = (): void => {
    setToolbar([]);

    // eslint-disable-next-line
    // @ts-ignore
    setActiveMenuIndex(undefined);
  };

  return (
    <LayoutContext.Provider
      value={{
        toolbar,
        setToolbar,
        isMenuOpen,
        activeMenuIndex,
        setActiveMenuIndex,
        activeMenu:
          activeMenuIndex !== undefined ? toolbar[activeMenuIndex] : undefined,
        resetLayout,
      }}
    >
      {props.children}
    </LayoutContext.Provider>
  );
};

export { LayoutContext, LayoutContextProvider, useLayoutContext };
