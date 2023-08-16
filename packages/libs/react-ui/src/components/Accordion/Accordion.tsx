import useLinked from './useLinked';
import { IAccordionSectionsProps } from '.';

import React, { FC, FunctionComponentElement } from 'react';

export interface IAccordionRootProps {
  children?: React.ReactNode;
  linked?: boolean;
  openSection?: number;
}

export const AccordionRoot: FC<IAccordionRootProps> = ({
  children,
  linked,
  openSection,
}) => {
  if (linked) {
    const { setUsingLinked } = useLinked(openSection);
    setUsingLinked(true);
  }
  return <div data-testid="kda-accordion-wrapper">{children}</div>;
};
