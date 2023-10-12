import {
  accordionButtonClass,
  accordionToggleIconClass,
} from './Accordion.css';

import { SystemIcon } from '@components/Icon';
import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';

export interface IAccordionHeadingProps {
  icon: keyof typeof SystemIcon;
  isOpen: boolean;
  onClick?: () => void;
  title: string;
}

export const AccordionHeading: FC<IAccordionHeadingProps> = ({
  icon,
  isOpen,
  onClick,
  title,
}) => {
  const Icon = SystemIcon[icon];
  return (
    <button className={classNames([accordionButtonClass])} onClick={onClick}>
      <h3>{title}</h3>
      <Icon
        className={classNames(accordionToggleIconClass, {
          isOpen,
        })}
        size="sm"
      />
    </button>
  );
};
