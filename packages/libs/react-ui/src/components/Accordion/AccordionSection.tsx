'use client';

import {
  accordionButtonClass,
  accordionContentClass,
  accordionSectionWrapperClass,
  accordionToggleIconClass,
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
      className={accordionSectionWrapperClass}
      data-testid="kda-accordion-section"
    >
      <button className={accordionButtonClass} onClick={handleClick}>
        {title}
        <SystemIcon.Close
          className={classNames(accordionToggleIconClass, {
            isOpen,
          })}
          size="xs"
        />
      </button>

      {isOpen && children && (
        <div className={accordionContentClass}>{children}</div>
      )}
    </section>
  );
};
