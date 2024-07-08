import { createContext } from 'react';

interface INavHeaderContext {
  setActiveHref: React.Dispatch<React.SetStateAction<string | undefined>>;
  activeHref?: string;
}

export const NavHeaderContext = createContext<INavHeaderContext>({
  setActiveHref: () => {},
  activeHref: undefined,
});
