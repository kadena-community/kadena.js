'use client';

import {
  navAccordionGroupButtonClass,
  navAccordionGroupIconClass,
  navAccordionGroupListClass,
  navAccordionGroupListItemClass,
  navAccordionGroupTitleClass,
  navAccordionListClass,
} from './NavAccordion.css';
import type { INavAccordionLinkProps } from './NavAccordionLink';

import { accordionButtonClass } from '@components/Accordion/Accordion.css';
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
  };

  return (
    <span>
      <button
        className={classNames([
          accordionButtonClass,
          navAccordionGroupButtonClass,
        ])}
        onClick={handleClick}
      >
        <SystemIcon.ChevronDown
          className={classNames(navAccordionGroupIconClass, {
            isOpen,
          })}
          size="sm"
        />
        <span className={navAccordionGroupTitleClass}>{title}</span>
      </button>

      {children && isOpen && (
        <ul
          className={classNames([
            navAccordionListClass,
            navAccordionGroupListClass,
          ])}
        >
          {Children.map(children, (child) => (
            <li className={navAccordionGroupListItemClass}>{child}</li>
          ))}
        </ul>
      )}
    </span>
  );
};
