'use client';

import {
  accordionContentWrapperClass,
  accordionSectionClass,
  accordionSectionHeadingClass,
  accordionTitleClass,
  accordionTitleVariants,
  toggleButtonClass,
} from './Accordion.css';

import { SystemIcon } from '@components/Icon';
import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';

export interface IAccordionSectionProps {
  children?: React.ReactNode;
  index?: number;
  isOpen?: boolean;
  onClick?: () => void;
  onClose?: () => void;
  onOpen?: () => void;
  title: string;
}

export const AccordionSection: FC<IAccordionSectionProps> = ({
  children,
  isOpen,
  onClick,
  onClose,
  onOpen,
  title,
}) => {
  const handleClick = (): void => {
    if (isOpen) {
      onClose?.();
    } else {
      onOpen?.();
    }
    onClick?.();
  };
  return (
    <section
      className={accordionSectionClass}
      data-testid="kda-accordion-section"
    >
      <div
        className={classNames(
          accordionSectionHeadingClass,
          accordionTitleVariants[isOpen ? 'opened' : 'closed'],
        )}
        onClick={handleClick}
      >
        <span
          data-testid="kda-accordion-section-title"
          className={accordionTitleClass}
        >
          {title}
        </span>

        <button
          role="button"
          className={classNames(toggleButtonClass, {
            isOpen,
          })}
        >
          <SystemIcon.Close size="sm" />
        </button>
      </div>

      {isOpen && children && (
        <div className={accordionContentWrapperClass}>{children}</div>
      )}
    </section>
  );
};
