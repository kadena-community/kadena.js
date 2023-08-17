import { IAccordionSectionsProps } from '.';

import type { FC, FunctionComponentElement } from 'react';
import React from 'react';

export interface IAccordionRootProps {
  children?: FunctionComponentElement<IAccordionSectionsProps>;
}

export const AccordionRoot: FC<IAccordionRootProps> = ({ children }) => {
  return <div data-testid="kda-accordion-wrapper">{children}</div>;
};
