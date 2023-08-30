import { SystemIcon, Tooltip } from '@kadena/react-ui';

import { gridMiniMenuListButtonStyle } from './styles.css';

import classNames from 'classnames';
import Link from 'next/link';
import React, { ButtonHTMLAttributes, FC, useRef } from 'react';

export interface IMenuButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  href?: string;
  active?: boolean;
  icon: keyof typeof SystemIcon;
}

export const MenuButton: FC<IMenuButtonProps> = ({
  active,
  title,
  href,
  icon,
  ...rest
}) => {
  const Icon = SystemIcon[icon];
  // eslint-disable-next-line
  // @ts-ignore
  const tooltipRef = useRef<HTMLDivElement>(null);
  const button = (
    <>
      <button
        className={classNames(gridMiniMenuListButtonStyle, { active })}
        onMouseEnter={(e) => Tooltip.handler(e, tooltipRef)}
        onMouseLeave={(e) => Tooltip.handler(e, tooltipRef)}
        {...rest}
      >
        <Icon />
      </button>
      {!!title && (
        <Tooltip.Root placement="right" ref={tooltipRef}>
          {title}
        </Tooltip.Root>
      )}
    </>
  );

  if (href) return <Link href={href}>{button}</Link>;
  return button;
};
