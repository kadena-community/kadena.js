import {
  accordionContentWrapperClass,
  accordionSectionClass,
  accordionTitleClass,
  accordionTitleVariants,
  toggleButtonClass,
} from './Accordion.css';

import { SystemIcon } from '@components/Icon';
import classNames from 'classnames';
import React, { FC, useEffect, useRef } from 'react';

export interface IAccordionSectionProps {
  title: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  onOpen?: () => void;
  onClose?: () => void;
}

export const AccordionSection: FC<IAccordionSectionProps> = ({
  isOpen = false,
  title,
  children,
  onToggle,
  onOpen,
  onClose,
}) => {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    if (isOpen) onOpen?.();
    else onClose?.();
  }, [isOpen]);

  return (
    <div className={accordionSectionClass}>
      <div
        data-testid="kda-accordion-title"
        onClick={onToggle}
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
