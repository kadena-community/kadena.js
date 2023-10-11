'use client';

import type { INavAccordionLinkProps, INavAccordionSectionProps } from '.';
import type { NavAccordionState } from './NavAccordion.context';
import {
  initialOpenSections,
  NavAccordionContext,
} from './NavAccordion.context';

import type { FC, FunctionComponentElement } from 'react';
import React, { useState } from 'react';

type Child = FunctionComponentElement<
  INavAccordionSectionProps | INavAccordionLinkProps
>;
export interface INavAccordionRootProps {
  children?: Child[];
  linked?: boolean;
}

export const NavAccordionRoot: FC<INavAccordionRootProps> = ({
  children,
  linked = false,
}) => {
  const [openSections, setOpenSections] =
    useState<NavAccordionState>(initialOpenSections);

  return (
    <NavAccordionContext.Provider
      value={{ openSections, setOpenSections, linked }}
    >
      <nav>{children}</nav>
    </NavAccordionContext.Provider>
  );
};
