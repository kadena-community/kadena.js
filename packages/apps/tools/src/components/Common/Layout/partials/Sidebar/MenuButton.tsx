import { SystemIcon, Tooltip } from '@kadena/react-ui';
import classNames from 'classnames';
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
  icon: keyof typeof SystemIcon;
  rotateClass?: string;
}

export const MenuButton: FC<IMenuButtonProps> = ({
  active,
  title,
  icon,
  rotateClass,
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

  return (
    <Tooltip isDisabled={!title} position="right" content={title}>
      <button
        className={classNames(gridMiniMenuListButtonStyle, rotationClass, {
          active,
        })}
        {...rest}
        aria-label={title}
      >
        <Icon size={'sm'} />
      </button>
    </Tooltip>
  );
};
