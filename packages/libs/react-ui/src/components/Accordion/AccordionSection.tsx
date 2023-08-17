import { toggleButtonClass } from './Accordion.css';

import { SystemIcon } from '@components/Icon';
import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';

export interface IAccordionSectionProps {
  children: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  title: React.ReactNode;
}

export const AccordionSection: FC<IAccordionSectionProps> = ({
  title,
  isOpen,
}) => {
  return (
    <div>
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
  );
};
