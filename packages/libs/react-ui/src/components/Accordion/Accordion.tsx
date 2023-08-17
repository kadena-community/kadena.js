import { IAccordionSectionsProps } from '.';

import React, { FC, FunctionComponentElement } from 'react';

export interface IAccordionRootProps {
  children?: FunctionComponentElement<IAccordionSectionsProps>;
}

export const AccordionRoot: FC<IAccordionRootProps> = ({ children }) => {
  return <div data-testid="kda-accordion-wrapper">{children}</div>;
};
