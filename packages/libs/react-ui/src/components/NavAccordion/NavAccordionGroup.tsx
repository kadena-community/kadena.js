'use client';

import {
  navAccordionArrowButtonClass,
  navAccordionButtonClass,
  navAccordionGroupClass,
  navAccordionGroupIconClass,
  navAccordionGroupListClass,
  navAccordionGroupTitleClass,
} from './NavAccordion.css';
import type { INavAccordionLinkProps } from './NavAccordionLink';
import { NavAccordionLink } from './NavAccordionLink';

import { SystemIcon } from '@components/Icon';
import classNames from 'classnames';
import type { FC, FunctionComponentElement } from 'react';
import React, { useState } from 'react';

export interface INavAccordionGroupProps {
  children: FunctionComponentElement<INavAccordionLinkProps>[];
  index?: number;
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
    <li className={classNames([navAccordionGroupClass])}>
      <button
        className={classNames([
          navAccordionButtonClass,
          navAccordionArrowButtonClass,
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
      {children && (
        <ul
          className={navAccordionGroupListClass}
          style={!isOpen ? { display: 'none' } : {}}
        >
          {React.Children.map(children, (link) => (
            <NavAccordionLink
              active={link.props.active}
              deepLink={true}
              href="https://docs.kadena.io/"
            >
              {link.props.children}
            </NavAccordionLink>
          ))}
        </ul>
      )}
    </li>
  );
};
