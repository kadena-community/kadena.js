'use client';

import type { INavAccordionLinkProps, INavAccordionSectionProps } from '.';
import type { NavAccordionState } from './NavAccordion.context';
import {
  initialOpenSections,
  NavAccordionContext,
} from './NavAccordion.context';
import { navAccordionWrapperClass } from './NavAccordion.css';

import { darkThemeClass } from '@theme/index';
import type { FC, FunctionComponentElement } from 'react';
import React, { useState } from 'react';

type Child = FunctionComponentElement<
  INavAccordionSectionProps | INavAccordionLinkProps
>;
export interface INavAccordionRootProps {
  children?: Child[];
  linked?: boolean;
  darkMode?: boolean;
}

export const NavAccordionRoot: FC<INavAccordionRootProps> = ({
  children,
  linked = false,
  darkMode = false,
}) => {
  const [openSections, setOpenSections] =
    useState<NavAccordionState>(initialOpenSections);

  const NavElement = (): JSX.Element => (
    <nav className={navAccordionWrapperClass}>{children}</nav>
  );

  return (
    <NavAccordionContext.Provider
      value={{ openSections, setOpenSections, linked }}
    >
      {darkMode ? (
        <div className={darkThemeClass}>
          <NavElement />
        </div>
      ) : (
        <NavElement />
      )}
    </NavAccordionContext.Provider>
  );
};
