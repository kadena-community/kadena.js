import {
  accordionContentWrapperClass,
  accordionSectionClass,
  accordionTitleClass,
  accordionTitleVariants,
  toggleButtonClass,
} from './Accordion.css';
import useLinked from './useLinked';

import { SystemIcon } from '@components/Icon';
import classNames from 'classnames';
import React, { FC, useState } from 'react';

export interface IAccordionSectionProps {
  title: React.ReactNode;
  children: React.ReactNode;
  onToggle?: () => void;
  onOpen?: () => void;
  onClose?: () => void;
}

export const AccordionSection: FC<IAccordionSectionProps> = ({
  title,
  children,
  onOpen,
  onClose,
}) => {
  const { usingLinked, activeSection, setActiveSection } = useLinked();
  const [isOpen, setIsOpen] = useState(false);

  const onToggle = (): void => (isOpen ? onClose?.() : onOpen?.());
  const handleClick = (): void => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={accordionSectionClass} data-testid="kda-accordion-section">
      <div
        data-testid="kda-accordion-section-title"
        onClick={() => {
          handleClick();
          onToggle();
        }}
        className={classNames(
          accordionTitleClass,
          accordionTitleVariants[isOpen ? 'opened' : 'closed'],
        )}
      >
        <span>{title}</span>

        <button
          role="button"
          className={classNames(toggleButtonClass, {
            isOpen,
          })}
        >
          <SystemIcon.Close size="sm" />
        </button>
      </div>

      {isOpen && <div className={accordionContentWrapperClass}>{children}</div>}
    </div>
  );
};
