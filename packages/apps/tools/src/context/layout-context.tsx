import type { ISidebarToolbarItem } from '@/types/Layout';
import type { PropsWithChildren } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { menuData } from '../constants/side-menu-items';

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
  isMenuOpen: true,
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

export const useToolbar = (
  toolbar: ISidebarToolbarItem[],
  pathName?: string,
): void => {
  const { setToolbar, setActiveMenuIndex } =
    useLayoutContext();
  useEffect(() => {
    setToolbar(toolbar);

    // set menu from URL param
    if (pathName) {
      const mainPath = pathName.split('/')[1];

      const activeMenu = menuData.find((item) => item.href.includes(mainPath));
      if (!activeMenu) return;

      const index = menuData.indexOf(activeMenu);
      setActiveMenuIndex(index);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

const LayoutContextProvider = (props: PropsWithChildren): JSX.Element => {
  const [toolbar, setToolbar] = useState<ISidebarToolbarItem[]>([]);
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | undefined>();
  const isMenuOpen = Number.isInteger(activeMenuIndex);

  const resetLayout = (): void => {
    setToolbar([]);

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
