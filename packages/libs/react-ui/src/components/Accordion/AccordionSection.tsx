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
  openSections?: number[];
}

export const AccordionSection: FC<IAccordionSectionProps> = ({
  children,
  index = 0,
  title,
  onClick,
  openSections,
}) => {
  const isOpen = openSections?.includes(index);
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
      >
        <span
          data-testid="kda-accordion-section-title"
          onClick={onClick}
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
