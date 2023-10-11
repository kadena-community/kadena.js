import { MenuContext } from './MenuProvider';

import { useContext } from 'react';

const defaultContext: IUseMenuProps = {
  toggleMenu: () => {},
  toggleAside: () => {},
  closeMenu: () => {},
  isAsideOpen: false,
  isMenuOpen: false,
};

export const useMenu = (): IUseMenuProps =>
  useContext(MenuContext) ?? defaultContext;
