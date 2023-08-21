import type { IAccordionRootProps } from './Accordion';
import { AccordionRoot } from './Accordion';
import type { IAccordionSectionProps } from './AccordionSection';
import { AccordionSection } from './AccordionSection';

import type { FC } from 'react';

export { IAccordionRootProps, IAccordionSectionProps };

export interface IAccordionProps {
  Root: FC<IAccordionRootProps>;
  Section: FC<IAccordionSectionProps>;
}

export const Accordion: IAccordionProps = {
  Root: AccordionRoot,
  Section: AccordionSection,
};
