'use client';

import {
  accordionContentWrapperClass,
  accordionSectionClass,
  accordionSectionHeadingClass,
  accordionTitleClass,
  toggleIconClass,
  toggleIconWrapperClass,
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
      <button
        className={classNames(accordionSectionHeadingClass, {
          isOpen,
        })}
        onClick={handleClick}
      >
        <span
          data-testid="kda-accordion-section-title"
          className={accordionTitleClass}
        >
          {title}
        </span>

        <span className={toggleIconWrapperClass}>
          <SystemIcon.Close
            className={classNames(toggleIconClass, {
              isOpen,
            })}
            size="sm"
          />
        </span>
      </button>

      {isOpen && children && (
        <div className={accordionContentWrapperClass}>{children}</div>
      )}
    </section>
  );
};
