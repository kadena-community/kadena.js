import { useContext } from 'react';
import { MenuContext } from './MenuProvider';

const defaultContext: IUseMenuProps = {
  toggleMenu: () => {},
  toggleAside: () => {},
  closeMenu: () => {},
  isAsideOpen: false,
  isMenuOpen: false,
};

export const useMenu = (): IUseMenuProps =>
  useContext(MenuContext) ?? defaultContext;
