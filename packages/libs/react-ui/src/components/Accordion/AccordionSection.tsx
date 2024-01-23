'use client';
import classNames from 'classnames';
import type { FC } from 'react';
import React, { useContext } from 'react';
import { SystemIcon } from '../Icon';
import { AccordionContext } from './Accordion.context';
import {
  accordionButtonClass,
  accordionContentClass,
  accordionHeadingTitleClass,
  accordionSectionClass,
  accordionToggleIconClass,
} from './Accordion.css';

export interface IAccordionSectionProps {
  children?: React.ReactNode;
  onClose?: () => void;
  onOpen?: () => void;
  title: string;
}

export const AccordionSection: FC<IAccordionSectionProps> = ({
  children,
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
  };
  return (
    <section
      className={accordionSectionClass}
      data-testid="kda-accordion-section"
    >
      <button
        className={classNames([accordionButtonClass])}
        onClick={handleClick}
      >
        <h3 className={accordionHeadingTitleClass}>{title}</h3>
        <SystemIcon.Close
          className={classNames(accordionToggleIconClass, {
            isOpen,
          })}
          size="sm"
        />
      </button>
      {children && isOpen && (
        <div className={accordionContentClass}>{children}</div>
      )}
    </section>
  );
};
