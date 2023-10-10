'use client';

import { NavAccordionContext } from './NavAccordion';
import {
  navAccordionButtonClass,
  navAccordionContentClass,
  navAccordionContentListClass,
  navAccordionSectionWrapperClass,
  navAccordionToggleIconClass,
} from './NavAccordion.css';
import type { INavAccordionGroupProps } from './NavAccordionGroup';
import type { INavAccordionLinkProps } from './NavAccordionLink';

import { SystemIcon } from '@components/Icon';
import classNames from 'classnames';
import type { FC, FunctionComponentElement } from 'react';
import React, { useContext } from 'react';

export interface INavAccordionSectionProps {
  children?: FunctionComponentElement<
    INavAccordionGroupProps | INavAccordionLinkProps
  >[];
  index?: number;
  onClick?: () => void;
  onClose?: () => void;
  onOpen?: () => void;
  title: string;
}

export const NavAccordionSection: FC<INavAccordionSectionProps> = ({
  children,
  index = 0,
  onClick,
  onClose,
  onOpen,
  title,
}) => {
  const isOpen = useContext(NavAccordionContext).includes(index);
  const handleClick = (): void => {
    if (isOpen) {
      onClose?.();
    } else {
      onOpen?.();
    }
    onClick?.();
  };

  return (
    <section className={navAccordionSectionWrapperClass}>
      <button className={navAccordionButtonClass} onClick={handleClick}>
        {title}
        <SystemIcon.Close
          className={classNames(navAccordionToggleIconClass, {
            isOpen,
          })}
          size="xs"
        />
      </button>

      {children && (
        <ul
          style={!isOpen ? { display: 'none' } : {}}
          className={classNames([
            navAccordionContentClass,
            navAccordionContentListClass,
          ])}
        >
          {children}
        </ul>
      )}
    </section>
  );
};
