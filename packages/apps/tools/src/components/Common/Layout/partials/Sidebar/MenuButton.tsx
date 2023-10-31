import { SystemIcon, Tooltip } from '@kadena/react-ui';
import classNames from 'classnames';
import Link from 'next/link';
import type { ButtonHTMLAttributes, FC } from 'react';
import React, { useRef } from 'react';
import {
  gridMiniMenuListButtonStyle,
  iconLeftStyle,
  iconRightStyle,
} from './styles.css';

export interface IMenuButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  href?: string;
  active?: boolean;
  icon: keyof typeof SystemIcon;
  rotateClass?: string;
}

export const MenuButton: FC<IMenuButtonProps> = ({
  active,
  title,
  href,
  icon,
  rotateClass,
  ...rest
}) => {
  const Icon = SystemIcon[icon];
  // eslint-disable-next-line
  // @ts-ignore
  const tooltipRef = useRef(null);
  const rotationClass =
    rotateClass === undefined
      ? ''
      : rotateClass === 'left'
      ? iconLeftStyle
      : iconRightStyle;

  const button = (
    <>
      <button
        className={classNames(gridMiniMenuListButtonStyle, rotationClass, {
          active,
        })}
        onMouseEnter={(e) => Tooltip.handler(e, tooltipRef)}
        onMouseLeave={(e) => Tooltip.handler(e, tooltipRef)}
        {...rest}
        aria-label={title}
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
