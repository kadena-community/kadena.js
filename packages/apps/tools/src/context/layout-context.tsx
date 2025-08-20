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
}

const LayoutContext = createContext<ILayoutContext>({
  toolbar: [],
  setToolbar: () => {},
  isMenuOpen: false,
  setIsMenuOpen: () => {},
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
  const { setToolbar, setActiveMenuIndex } = useLayoutContext();
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
  }, [pathName, setActiveMenuIndex, setToolbar, toolbar]);
};

const LayoutContextProvider = (props: PropsWithChildren): React.JSX.Element => {
  const [toolbar, setToolbar] = useState<ISidebarToolbarItem[]>([]);
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | undefined>(0);
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const resetLayout = (): void => {
    setToolbar([]);

    setActiveMenuIndex(undefined);
  };

  return (
    <LayoutContext
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
      }}
    >
      {props.children}
    </LayoutContext>
  );
};

export { LayoutContext, LayoutContextProvider, useLayoutContext };
