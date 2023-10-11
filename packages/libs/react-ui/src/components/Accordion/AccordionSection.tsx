'use client';

import { AccordionContext } from './Accordion.context';
import {
  accordionCollapse,
  accordionContentClass,
  accordionExpand,
  accordionSectionClass,
} from './Accordion.css';
import { AccordionHeading } from './AccordionHeading';

import classNames from 'classnames';
import type { FC } from 'react';
import React, { useContext } from 'react';

export interface IAccordionSectionProps {
  children?: React.ReactNode;
  index?: number;
  onClick?: () => void;
  onClose?: () => void;
  onOpen?: () => void;
  title: string;
}

export const AccordionSection: FC<IAccordionSectionProps> = ({
  children,
  onClick,
  onClose,
  onOpen,
  title,
}) => {
  const { openSections, setOpenSections, linked } =
    useContext(AccordionContext);
  const sectionId = title.replace(/\s+/g, '-').toLowerCase();
  const isOpen = openSections.includes(sectionId);

  const handleClick = (): void => {
    if (isOpen) {
      setOpenSections(
        linked ? [] : [...openSections.filter((i) => i !== sectionId)],
      );
      onClose?.();
    } else {
      setOpenSections(linked ? [sectionId] : [...openSections, sectionId]);
      onOpen?.();
    }
    onClick?.();
  };
  return (
    <section
      className={accordionSectionClass}
      data-testid="kda-accordion-section"
    >
      <AccordionHeading
        title={title}
        isOpen={isOpen}
        icon={'Close'}
        onClick={handleClick}
      />
      {children && (
        <div
          className={classNames(accordionContentClass, [
            isOpen ? accordionExpand : accordionCollapse,
          ])}
        >
          {children}
        </div>
      )}
    </section>
  );
};
