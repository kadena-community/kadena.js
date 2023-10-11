'use client';

import type { IAccordionSectionProps } from '.';
import type { OpenSections } from './Accordion.context';
import { AccordionContext } from './Accordion.context';

import type { FC, FunctionComponentElement } from 'react';
import React, { useState } from 'react';

export interface IAccordionRootProps {
  children?: FunctionComponentElement<IAccordionSectionProps>[];
  linked?: boolean;
  initialOpenSection?: OpenSections;
}

export const AccordionRoot: FC<IAccordionRootProps> = ({
  children,
  linked = false,
  initialOpenSection = [],
}) => {
  const [openSections, setOpenSections] =
    useState<OpenSections>(initialOpenSection);

  return (
    <AccordionContext.Provider
      value={{ openSections, setOpenSections, linked }}
    >
      {children}
    </AccordionContext.Provider>
  );
};
