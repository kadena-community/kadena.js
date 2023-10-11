'use client';

import { NavAccordionContext } from './NavAccordion.context';
import {
  accordionExpand,
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
  onClick?: () => void;
  onClose?: () => void;
  onOpen?: () => void;
  title: string;
}

export const NavAccordionSection: FC<INavAccordionSectionProps> = ({
  children,
  onClick,
  onClose,
  onOpen,
  title,
}) => {
  const { openSections, setOpenSections, linked } =
    useContext(NavAccordionContext);
  const sectionId = title.replace(/\s+/g, '-').toLowerCase();
  const isOpen = openSections.includes(sectionId);

  const handleClick = (): void => {
    if (isOpen) {
      setOpenSections(
        linked ? [] : [...openSections.filter((i) => i !== sectionId)],
      );
      onClose?.();
    } else {
      setOpenSections(linked ? [sectionId] : [...openSections, sectionId]);
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
          className={classNames({ [accordionExpand]: isOpen }, [
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
