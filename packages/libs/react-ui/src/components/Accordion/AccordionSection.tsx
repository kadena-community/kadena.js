'use client';

import {
  accordionContentWrapperClass,
  accordionSectionClass,
  accordionSectionHeadingClass,
  accordionTitleClass,
  accordionTitleVariants,
  toggleButtonClass,
  toggleIconClass,
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
    <article
      className={accordionSectionClass}
      data-testid="kda-accordion-section"
    >
      <header
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

        <button role="button" className={toggleButtonClass}>
          <SystemIcon.Close
            className={classNames(toggleIconClass, {
              isOpen,
            })}
            size="sm"
          />
        </button>
      </header>

      {isOpen && children && (
        <div className={accordionContentWrapperClass}>{children}</div>
      )}
    </article>
  );
};
