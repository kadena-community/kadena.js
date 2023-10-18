import { createContext } from 'react';

interface INavHeaderNavigationContext {
  setGlowPosition: (targetBounds: DOMRect) => void;
  setActiveHref: React.Dispatch<React.SetStateAction<string | undefined>>;
  activeHref?: string;
}

export const NavHeaderNavigationContext =
  createContext<INavHeaderNavigationContext>({
    setGlowPosition: () => {},
    setActiveHref: () => {},
    activeHref: undefined,
  });
