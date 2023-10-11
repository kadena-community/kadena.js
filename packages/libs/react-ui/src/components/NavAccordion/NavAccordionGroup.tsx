'use client';

import type { INavAccordionLinkProps } from './NavAccordionLink';

import {
  accordionButtonClass,
  accordionExpand,
  accordionToggleIconClass,
} from '@components/Accordion/Accordion.css';
import { SystemIcon } from '@components/Icon';
import classNames from 'classnames';
import type { FC, FunctionComponentElement } from 'react';
import React, { Children, useState } from 'react';

export interface INavAccordionGroupProps {
  children: FunctionComponentElement<INavAccordionLinkProps>[];
  index?: number;
  onClose?: () => void;
  onOpen?: () => void;
  onClick?: () => void;
  title: string;
}

export const NavAccordionGroup: FC<INavAccordionGroupProps> = ({
  children,
  onClose,
  onOpen,
  onClick,
  title,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = (): void => {
    if (isOpen) {
      onClose?.();
    } else {
      onOpen?.();
    }
    setIsOpen(!isOpen);
    onClick?.();
  };

  return (
    <span className={classNames([])}>
      <button
        className={classNames([accordionButtonClass])}
        onClick={handleClick}
      >
        <SystemIcon.ChevronDown
          className={classNames(accordionToggleIconClass, {
            isOpen,
          })}
          size="sm"
        />
        <span className={''}>{title}</span>
      </button>
      <span className={classNames({ [accordionExpand]: isOpen }, [])}>
        {Children.map(children, (child) => (
          <li>{child}</li>
        ))}
      </span>
    </span>
  );
};
