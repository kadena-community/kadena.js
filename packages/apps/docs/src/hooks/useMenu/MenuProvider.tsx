import { breakpoints } from '@kadena/kode-ui/styles';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useMedia } from 'react-use';

export const MenuContext = createContext<IUseMenuProps | undefined>(undefined);

export const MenuProvider: React.FC<ITMenuProviderProps> = (props) => {
  const context = useContext(MenuContext);
  const isMediumDevice = useMedia(breakpoints.md, true);

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

  useEffect(() => {
    if (isMediumDevice) {
      setIsMenuOpen(false);
    }
  }, [isMediumDevice]);

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
