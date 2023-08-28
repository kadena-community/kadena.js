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
  onClose?: () => void;
  onOpen?: () => void;
  title: string;
  onClick?: () => void;
  isOpen?: boolean;
}

export const AccordionSection: FC<IAccordionSectionProps> = ({
  children,
  index = 0,
  title,
  onClick,
  isOpen,
}) => {
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
        onClick={onClick}
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
