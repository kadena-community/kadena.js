import React, { createContext, useContext, useState } from 'react';

export const MenuContext = createContext<IUseMenuProps | undefined>(undefined);

export const MenuProvider: React.FC<ITMenuProviderProps> = (props) => {
  const context = useContext(MenuContext);

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isAsideOpen, setIsAsideOpen] = useState<boolean>(false);

  const toggleMenu = (): void => {
    setIsMenuOpen((v) => !v);
    setIsAsideOpen(false);
  };

  const toggleAside = (): void => {
    setIsAsideOpen((v) => !v);
    setIsMenuOpen(false);
  };

  const closeMenu = (): void => setIsMenuOpen(false);

  if (context) return <>{props.children}</>;
  return (
    <MenuContext.Provider
      value={{ toggleMenu, toggleAside, closeMenu, isMenuOpen, isAsideOpen }}
    >
      {props.children}
    </MenuContext.Provider>
  );
};
