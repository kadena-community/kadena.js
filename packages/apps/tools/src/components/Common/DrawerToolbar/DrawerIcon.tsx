import { gridMiniMenuListButtonStyle } from '@/components/Common/Layout/partials/Sidebar/styles.css';
import { SystemIcon } from '@kadena/react-ui';
import type { ButtonHTMLAttributes, FC } from 'react';
import React from 'react';

export interface IMenuButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  active?: boolean;
  icon: keyof typeof SystemIcon;
  rotateClass?: string;
}

export const DrawerIconButton: FC<IMenuButtonProps> = ({
  active,
  title,
  icon,
  rotateClass,
  ...rest
}) => {
  const Icon = SystemIcon[icon];

  return (
    <>
      <button
        className={gridMiniMenuListButtonStyle}
        {...rest}
        aria-label={title}
      >
        <Icon size={'sm'} />
      </button>
    </>
  );
};
