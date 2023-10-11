'use client';

import type { IAccordionSectionProps } from '.';
import type { AccordionState } from './Accordion.context';
import { AccordionContext, initialOpenSections } from './Accordion.context';

import type { FC, FunctionComponentElement } from 'react';
import React, { useState } from 'react';

export interface IAccordionRootProps {
  children?: FunctionComponentElement<IAccordionSectionProps>[];
  linked?: boolean;
  initialOpenSection?: number;
}

export const AccordionRoot: FC<IAccordionRootProps> = ({
  children,
  linked = false,
  initialOpenSection = undefined,
}) => {
  const [openSections, setOpenSections] =
    useState<AccordionState>(initialOpenSections);

  return (
    <AccordionContext.Provider
      value={{ openSections, setOpenSections, linked }}
    >
      {children}
    </AccordionContext.Provider>
  );
};
