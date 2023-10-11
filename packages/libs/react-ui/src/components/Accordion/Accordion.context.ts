import type { Dispatch, SetStateAction } from 'react';
import { createContext } from 'react';

export type OpenSections = string[];

interface IAccordionContext {
  openSections: OpenSections;
  setOpenSections: Dispatch<SetStateAction<OpenSections>>;
  linked: boolean;
}

export const initialOpenSections: OpenSections = [];
export const AccordionContext = createContext<IAccordionContext>({
  openSections: initialOpenSections,
  setOpenSections: () => {},
  linked: false,
});
