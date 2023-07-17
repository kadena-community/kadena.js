import { accordionWrapperClass } from './Accordion.css';
import { AccordionSection, IAccordionSection } from './AccordionSection';

import React, { FC, useState } from 'react';

export interface IAccordionProps {
  className?: string;
  sections: Omit<IAccordionSection, 'isOpen' | 'onToggle'>[];
  linked?: boolean;
}

export const Accordion: FC<IAccordionProps> = ({ sections, linked = true }) => {
  const [expandedSections, setExpandedSections] = useState<number[]>([]);
  const handleOpen = (index: number): void => {
    if (linked) setExpandedSections([index]);
    else setExpandedSections([...expandedSections, index]);
  };
  const handleClose = (index: number): void => {
    setExpandedSections(expandedSections.filter((item) => item !== index));
  };

  const isOpen = (index: number): boolean => expandedSections.includes(index);

  const handleToggle = (index: number): void => {
    if (isOpen(index)) handleClose(index);
    else handleOpen(index);
  };

  return (
    <div className={accordionWrapperClass} data-testid="kda-accordion-wrapper">
      {sections.map((section, index) => (
        <AccordionSection
          isOpen={isOpen(index)}
          onToggle={() => handleToggle(index)}
          title={section.title}
          key={index}
        >
          {section.children}
        </AccordionSection>
      ))}
    </div>
  );
};
