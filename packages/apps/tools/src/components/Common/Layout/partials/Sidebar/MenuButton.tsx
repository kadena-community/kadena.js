import { SystemIcon, Tooltip } from '@kadena/react-ui';
import classNames from 'classnames';
import Link from 'next/link';
import type { ButtonHTMLAttributes, FC } from 'react';
import React from 'react';
import {
  gridMiniMenuListButtonStyle,
  iconLeftStyle,
  iconRightStyle,
} from './styles.css';

export interface IMenuButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  active?: boolean;
  href?: string;
  icon: keyof typeof SystemIcon;
  rotateClass?: string;
}

export const MenuButton: FC<IMenuButtonProps> = ({
  active,
  title,
  href = '#',
  icon,
  rotateClass,
  onClick,
  ...rest
}) => {
  const Icon = SystemIcon[icon];
  // @ts-ignore
  const rotationClass =
    rotateClass === undefined
      ? ''
      : rotateClass === 'left'
      ? iconLeftStyle
      : iconRightStyle;

  const button = (
    <button
      type="button"
      className={classNames(gridMiniMenuListButtonStyle, rotationClass, {
        active,
      })}
      {...rest}
      aria-label={title}
      onClick={onClick}
    >
      <span>
        <Icon size={'sm'} />
      </span>
    </button>
  );

  return (
    <Tooltip isDisabled={!title} position={'right'} content={title}>
      <Link href={href} target="_self">
        {button}
      </Link>
    </Tooltip>
  );
};
