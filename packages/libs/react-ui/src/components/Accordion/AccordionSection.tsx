import { SystemIcon } from '../Icon';

import {
  accordionContentWrapperClass,
  accordionSectionClass,
  accordionTitleClass,
  accordionTitleVariants,
  toggleButtonClass,
} from './Accordion.css';

import classNames from 'classnames';
import React, { FC, useEffect, useRef } from 'react';

export interface IAccordionSection {
  title: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  onOpen?: () => void;
  onClose?: () => void;
}

export const AccordionSection: FC<IAccordionSection> = ({
  isOpen = false,
  title,
  children,
  onToggle,
  onOpen,
  onClose,
}) => {
  const didMountRef = useRef(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const contentWrapperHeight = isOpen
    ? `${contentRef?.current?.clientHeight}px`
    : 0;

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

      <div
        className={accordionContentWrapperClass}
        style={{
          height: contentWrapperHeight,
        }}
      >
        <div ref={contentRef}>{children}</div>
      </div>
    </div>
  );
};
