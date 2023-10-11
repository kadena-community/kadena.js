import {
  accordionButtonClass,
  accordionToggleIconClass,
} from './Accordion.css';

import { SystemIcon } from '@components/Icon';
import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';

export interface IAccordionHeadingProps {
  className?: string;
  icon: keyof typeof SystemIcon;
  iconClassName?: string;
  isOpen: boolean;
  onClick?: () => void;
  title: string;
  titleClassName?: string;
}

export const AccordionHeading: FC<IAccordionHeadingProps> = ({
  className,
  icon,
  iconClassName = '',
  isOpen,
  onClick,
  title,
  titleClassName = '',
}) => {
  const Icon = SystemIcon[icon];
  return (
    <button
      className={classNames([accordionButtonClass], className)}
      onClick={onClick}
    >
      <span className={titleClassName}>{title}</span>
      <Icon
        className={classNames(iconClassName, accordionToggleIconClass, {
          isOpen,
        })}
        size="sm"
      />
    </button>
  );
};
