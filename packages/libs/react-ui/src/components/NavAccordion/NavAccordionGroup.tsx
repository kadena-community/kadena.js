'use client';

import {
  navAccordionButtonClass,
  navAccordionToggleIconClass,
} from './NavAccordion.css';
import type { INavAccordionLinkProps } from './NavAccordionLink';

import { SystemIcon } from '@components/Icon';
import classNames from 'classnames';
import type { FC, FunctionComponentElement } from 'react';
import React from 'react';

export interface INavAccordionGroupProps {
  children: FunctionComponentElement<INavAccordionLinkProps>[];
  index?: number;
  isOpen?: boolean;
  onClick?: () => void;
  onClose?: () => void;
  onOpen?: () => void;
  title: string;
}

export const NavAccordionGroup: FC<INavAccordionGroupProps> = ({
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
    <ul>
      <button className={navAccordionButtonClass} onClick={handleClick}>
        {title}
        <SystemIcon.Close
          className={classNames(navAccordionToggleIconClass, {
            isOpen,
          })}
          size="xs"
        />
      </button>
      {isOpen && children && <div>{children}</div>}
    </ul>
  );
};
