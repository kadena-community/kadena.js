import useLinked from './useLinked';
import { IAccordionSectionProps } from '.';

import React, { FC, FunctionComponentElement } from 'react';

export interface IAccordionSectionsProps {
  // children?: FunctionComponentElement<IAccordionSectionProps>[];
  children?: React.ReactNode;
  linked?: boolean;
  openSection?: number;
}

export const AccordionSections: FC<IAccordionSectionsProps> = ({
  children,
  linked,
  openSection = 0,
}) => {
  return <div data-testid="kda-accordion-sections">{children}</div>;
};
