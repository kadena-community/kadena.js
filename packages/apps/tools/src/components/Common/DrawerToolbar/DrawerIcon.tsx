import { gridMiniMenuListButtonStyle } from '@/components/Common/Layout/partials/Sidebar/styles.css';
import classNames from 'classnames';
import type { ButtonHTMLAttributes, FC, ReactElement } from 'react';
import React from 'react';

export interface IMenuButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  active?: boolean;
  icon: ReactElement;
  rotateClass?: string;
}

export const DrawerIconButton: FC<IMenuButtonProps> = ({
  active,
  title,
  icon,
  rotateClass,
  ...rest
}) => {
  return (
    <>
      <button
        className={classNames(gridMiniMenuListButtonStyle, {
          active,
        })}
        {...rest}
        aria-label={title}
      >
        {icon}
      </button>
    </>
  );
};
