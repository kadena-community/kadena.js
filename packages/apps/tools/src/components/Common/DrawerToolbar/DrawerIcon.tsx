import { gridMiniMenuListButtonStyle } from '@/components/Common/Layout/partials/Sidebar/styles.css';
import { SystemIcon } from '@kadena/react-ui';
import Link from 'next/link';
import type { ButtonHTMLAttributes, FC } from 'react';
import React from 'react';

export interface IMenuButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  href?: string;
  active?: boolean;
  icon: keyof typeof SystemIcon;
  rotateClass?: string;
}

export const DrawerIconButton: FC<IMenuButtonProps> = ({
  active,
  title,
  href,
  icon,
  rotateClass,
  ...rest
}) => {
  const Icon = SystemIcon[icon];

  const button = (
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

  if (href) return <Link href={href}>{button}</Link>;
  return button;
};
