import { menuData } from '@/constants/side-menu-items';
import type { ISidebarToolbarItem } from '@/types/Layout';
import type { PropsWithChildren } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface ILayoutContext {
  toolbar: ISidebarToolbarItem[];
  setToolbar: (toolbar: ISidebarToolbarItem[]) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
  activeMenuIndex?: number;
  setActiveMenuIndex: (index?: number) => void;
  activeMenu?: ISidebarToolbarItem;
  resetLayout: () => void;
  visibleLinks: boolean;
  setVisibleLinks: (value: boolean) => void;
}

const LayoutContext = createContext<ILayoutContext>({
  toolbar: [],
  setToolbar: () => {},
  isMenuOpen: false,
  setIsMenuOpen: () => {},
  setActiveMenuIndex: () => {},
  activeMenu: undefined,
  resetLayout: () => {},
  visibleLinks: false,
  setVisibleLinks: () => {},
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
  const { setToolbar, setActiveMenuIndex, activeMenuIndex, isMenuOpen } =
    useLayoutContext();
  useEffect(() => {
    setToolbar(toolbar);

    // set menu from URL param
    if (pathName) {
      const mainPath = pathName.split('/')[1];

      const activeMenu = menuData.find(
        (item) => item.href && item.href.includes(mainPath),
      );
      if (!activeMenu) return;

      const index = menuData.indexOf(activeMenu);
      setActiveMenuIndex(index);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMenuIndex, isMenuOpen]);
};

const LayoutContextProvider = (props: PropsWithChildren): JSX.Element => {
  const [toolbar, setToolbar] = useState<ISidebarToolbarItem[]>([]);
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | undefined>(0);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [visibleLinks, setVisibleLinks] = useState(false);

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
        setIsMenuOpen,
        activeMenuIndex,
        setActiveMenuIndex,
        activeMenu:
          activeMenuIndex !== undefined ? toolbar[activeMenuIndex] : undefined,
        resetLayout,
        visibleLinks,
        setVisibleLinks,
      }}
    >
      {props.children}
    </LayoutContext.Provider>
  );
};

export { LayoutContext, LayoutContextProvider, useLayoutContext };
