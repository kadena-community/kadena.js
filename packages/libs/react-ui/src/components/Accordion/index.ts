import type { FC } from 'react';
import type { IAccordionRootProps } from './Accordion';
import { AccordionRoot } from './Accordion';
import type { IAccordionSectionProps } from './AccordionSection';
import { AccordionSection } from './AccordionSection';

export { IAccordionRootProps, IAccordionSectionProps };

export interface IAccordionProps {
  Root: FC<IAccordionRootProps>;
  Section: FC<IAccordionSectionProps>;
}

export const Accordion: IAccordionProps = {
  Root: AccordionRoot,
  Section: AccordionSection,
};
