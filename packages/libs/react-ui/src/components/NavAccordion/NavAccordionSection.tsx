'use client';

import { NavAccordionContext } from './NavAccordion.context';
import {
  navAccordionListClass,
  navAccordionListItemClass,
} from './NavAccordion.css';
import type { INavAccordionGroupProps } from './NavAccordionGroup';
import { NavAccordionGroup } from './NavAccordionGroup';
import type { INavAccordionLinkProps } from './NavAccordionLink';

import {
  accordionCollapse,
  accordionExpand,
  accordionSectionClass,
} from '@components/Accordion/Accordion.css';
import { AccordionHeading } from '@components/Accordion/AccordionHeading';
import classNames from 'classnames';
import type { FC, FunctionComponentElement as FCElement } from 'react';
import React, { Children, useContext } from 'react';

export interface INavAccordionSectionProps {
  children?:
    | FCElement<INavAccordionGroupProps>[]
    | FCElement<INavAccordionLinkProps>[]
    | FCElement<INavAccordionGroupProps>
    | FCElement<INavAccordionLinkProps>;
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
  const sectionId = title.replace(/\s+/g, '').toLowerCase();
  const isOpen = openSections.includes(sectionId);

  console.log(openSections);

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
    <section className={classNames([accordionSectionClass])}>
      <AccordionHeading
        title={title}
        isOpen={isOpen}
        icon={'Close'}
        onClick={handleClick}
      />

      {children && (
        <ul
          className={classNames(navAccordionListClass, [
            isOpen ? accordionExpand : accordionCollapse,
          ])}
        >
          {Children.map(children, (child) => {
            const Tag = child.type === NavAccordionGroup ? 'ul' : 'li';
            const className =
              Tag === 'ul' ? navAccordionListClass : navAccordionListItemClass;
            return <Tag className={className}>{child}</Tag>;
          })}
        </ul>
      )}
    </section>
  );
};
