'use client';

import { AccordionSection, IAccordionSectionProps } from './AccordionSection';

import React, { FC, useState } from 'react';

export interface IAccordionProps {
  sections: Omit<IAccordionSectionProps, 'isOpen' | 'onToggle'>[];
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
    <div data-testid="kda-accordion-wrapper">
      {sections.map((section, index) => (
        <AccordionSection
          {...section}
          isOpen={isOpen(index)}
          onToggle={() => handleToggle(index)}
          key={String(section.title)}
        >
          {section.children}
        </AccordionSection>
      ))}
    </div>
  );
};
