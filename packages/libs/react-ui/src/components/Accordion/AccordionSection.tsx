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
  title: string;
}

export const AccordionSection: FC<IAccordionSectionProps> = ({
  title,
  isOpen,
}) => {
  return (
    <>
      <span>{title}</span>

      <button
        role="button"
        className={classNames(toggleButtonClass, {
          isOpen,
        })}
      >
        <SystemIcon.Close size="sm" />
      </button>
    </>
  );
};
