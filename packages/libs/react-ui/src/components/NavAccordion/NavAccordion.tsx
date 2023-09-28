'use client';

import type { INavAccordionSectionProps } from '.';
import { navAccordionContentClass } from './NavAccordion.css';

import type { FC, FunctionComponentElement } from 'react';
import React, { useEffect, useState } from 'react';

export interface INavAccordionRootProps {
  children?: FunctionComponentElement<INavAccordionSectionProps>[];
  linked?: boolean;
  initialOpenSection?: number;
}

export const NavAccordionRoot: FC<INavAccordionRootProps> = ({
  children,
  linked = false,
  initialOpenSection = undefined,
}) => {
  const [openSections, setOpenSections] = useState([initialOpenSection]);

  useEffect(() => {
    if (linked && openSections.length > 1) {
      const lastOpen = openSections.pop() || undefined;
      setOpenSections([lastOpen]);
    }
  }, [linked]);

  return (
    <div data-testid="kda-nav-accordion-sections">
      {React.Children.map(children, (section, sectionIndex) =>
        React.cloneElement(
          section as React.ReactElement<
            HTMLElement | INavAccordionSectionProps,
            React.JSXElementConstructor<JSX.Element & INavAccordionSectionProps>
          >,
          {
            index: sectionIndex,
            isOpen: openSections.includes(sectionIndex),
            className: navAccordionContentClass,
            onClick: () =>
              openSections.includes(sectionIndex)
                ? setOpenSections(
                    openSections.filter((i) => i !== sectionIndex),
                  )
                : setOpenSections(
                    linked ? [sectionIndex] : [...openSections, sectionIndex],
                  ),
          },
        ),
      )}
    </div>
  );
};
