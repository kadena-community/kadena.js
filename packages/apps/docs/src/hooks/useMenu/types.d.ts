interface IUseMenuProps {
  toggleMenu: () => void;
  toggleAside: () => void;
  closeMenu: () => void;
  isAsideOpen: boolean;
  isMenuOpen: boolean;
}

interface ITMenuProviderProps {
  children?: React.ReactNode;
}
