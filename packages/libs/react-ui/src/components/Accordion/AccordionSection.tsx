'use client';
import { SystemIcon } from '@components/Icon';
import classNames from 'classnames';
import type { FC } from 'react';
import React, { useContext, useEffect, useRef, useState } from 'react';
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
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | undefined>(undefined);

  const sectionId = title.replace(/\s+/g, '-').toLowerCase();
  const isOpen = openSections.includes(sectionId);

  useEffect(() => {
    const contentNode = contentRef?.current;
    const content = contentNode?.children[0];
    if (content && isOpen) {
      const rect = content.getBoundingClientRect();
      const { height } = rect;
      setContentHeight(height);
    } else {
      setContentHeight(0);
    }
  }, [isOpen]);

  const handleClick = (): void => {
    if (isOpen) {
      onClose?.();
      setOpenSections(linked ? [] : [...openSections.filter((i) => i !== sectionId)]);
    } else {
      onOpen?.();
      setOpenSections(linked ? [sectionId] : [...openSections, sectionId]);
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
      {children && (
        <div ref={contentRef} className={accordionContentClass} style={{ maxHeight: contentHeight }} aria-hidden={!isOpen}>{children}</div>
      )}
    </section>
  );
};
