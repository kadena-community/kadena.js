import type { Dispatch, SetStateAction } from 'react';
import { createContext } from 'react';

export type NavAccordionState = string[];

interface INavAccordionContext {
  openSections: NavAccordionState;
  setOpenSections: Dispatch<SetStateAction<NavAccordionState>>;
  linked: boolean;
}

export const initialOpenSections: NavAccordionState = [];
export const NavAccordionContext = createContext<INavAccordionContext>({
  openSections: initialOpenSections,
  setOpenSections: () => {},
  linked: false,
});
