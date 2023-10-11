import type { Dispatch, SetStateAction } from 'react';
import { createContext } from 'react';

export type AccordionState = string[];

interface IAccordionContext {
  openSections: AccordionState;
  setOpenSections: Dispatch<SetStateAction<AccordionState>>;
  linked: boolean;
}

export const initialOpenSections: AccordionState = [];
export const AccordionContext = createContext<IAccordionContext>({
  openSections: initialOpenSections,
  setOpenSections: () => {},
  linked: false,
});
