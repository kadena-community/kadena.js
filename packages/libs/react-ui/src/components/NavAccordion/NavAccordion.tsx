'use client';

import type { INavAccordionLinkProps, INavAccordionSectionProps } from '.';
import { NavAccordionLink } from './NavAccordionLink';
import { NavAccordionSection } from './NavAccordionSection';

import type { FC, FunctionComponentElement } from 'react';
import React, { createContext, useEffect, useState } from 'react';

type Child = FunctionComponentElement<
  INavAccordionSectionProps | INavAccordionLinkProps
>;
export interface INavAccordionRootProps {
  children?: Child[];
  linked?: boolean;
  initialOpenSection?: number;
}

export const NavAccordionContext = createContext<number[]>([]);

export const NavAccordionRoot: FC<INavAccordionRootProps> = ({
  children,
  linked = false,
  initialOpenSection = 0,
}) => {
  const [openSections, setOpenSections] = useState<number[]>([
    initialOpenSection,
  ]);

  useEffect(() => {
    if (linked && openSections.length > 1) {
      const lastOpen = openSections.pop() || 0;
      setOpenSections([lastOpen]);
    }
  }, [linked]);

  return (
    <nav>
      <NavAccordionContext.Provider value={openSections}>
        {React.Children.map(children as Child[], (child: Child, index) => {
          if (child.type === NavAccordionSection) {
            const { title, children } =
              child.props as INavAccordionSectionProps;
            return (
              <NavAccordionSection
                index={index}
                key={`section-${title}`}
                title={title}
                onClick={() =>
                  openSections.includes(index)
                    ? setOpenSections(openSections.filter((i) => i !== index))
                    : setOpenSections(
                        linked ? [index] : [...openSections, index],
                      )
                }
              >
                {children}
              </NavAccordionSection>
            );
          } else if (child.type === NavAccordionLink) {
            const { active, children } = child.props as INavAccordionLinkProps;
            return (
              <NavAccordionLink
                active={active}
                deepLink={false}
                href="https://docs.kadena.io/"
                shallowLink={true}
              >
                {children}
              </NavAccordionLink>
            );
          }
        })}
      </NavAccordionContext.Provider>
    </nav>
  );
};
