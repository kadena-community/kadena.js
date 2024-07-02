'use client';
import { MonoExpandMore } from '@kadena/kode-icons/system';
import classNames from 'classnames';
import type { FC, FunctionComponentElement } from 'react';
import React, { Children, useState } from 'react';
import { accordionButtonClass } from '../Accordion/Accordion.css';
import {
  navAccordionGroupButtonClass,
  navAccordionGroupIconClass,
  navAccordionGroupListClass,
  navAccordionGroupListItemClass,
  navAccordionGroupTitleClass,
  navAccordionListClass,
} from './NavAccordion.css';
import type { INavAccordionLinkProps } from './NavAccordionLink';

export interface INavAccordionGroupProps {
  children: FunctionComponentElement<INavAccordionLinkProps>[];
  onClose?: () => void;
  onOpen?: () => void;
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
    <div>
      <button
        className={classNames([
          accordionButtonClass,
          navAccordionGroupButtonClass,
        ])}
        onClick={handleClick}
      >
        <MonoExpandMore
          className={classNames(navAccordionGroupIconClass, {
            isOpen,
          })}
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
    </div>
  );
};
