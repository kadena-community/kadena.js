import type { IAccordionRootProps } from './Accordion';
import { AccordionRoot } from './Accordion';
import type { IAccordionSectionProps } from './AccordionSection';
import { AccordionSection } from './AccordionSection';
import type { IAccordionSectionsProps } from './AccordionSections';
import { AccordionSections } from './AccordionSections';

import type { FC } from 'react';

export { IAccordionRootProps, IAccordionSectionProps, IAccordionSectionsProps };

export interface IAccordionProps {
  Root: FC<IAccordionRootProps>;
  Sections: FC<IAccordionSectionsProps>;
  Section: FC<IAccordionSectionProps>;
}

export const Accordion: IAccordionProps = {
  Root: AccordionRoot,
  Sections: AccordionSections,
  Section: AccordionSection,
};
