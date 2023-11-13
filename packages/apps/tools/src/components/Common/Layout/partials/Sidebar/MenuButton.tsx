import { SystemIcon, Tooltip } from '@kadena/react-ui';
import classNames from 'classnames';
import type { ButtonHTMLAttributes, FC } from 'react';
import React, { useRef } from 'react';
import { gridMiniMenuListButtonStyle, iconLeftStyle, iconRightStyle } from './styles.css';

export interface IMenuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  active?: boolean;
  icon: keyof typeof SystemIcon;
  rotateClass?: string;
}

export const MenuButton: FC<IMenuButtonProps> = ({ active, title, icon, rotateClass, ...rest }) => {
  const Icon = SystemIcon[icon];
  // @ts-ignore
  const tooltipRef = useRef(null);
  const rotationClass =
    rotateClass === undefined ? '' : rotateClass === 'left' ? iconLeftStyle : iconRightStyle;

  return (
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
        <Icon size={'sm'} />
      </button>
      {!!title && (
        <Tooltip.Root placement="right" ref={tooltipRef}>
          {title}
        </Tooltip.Root>
      )}
    </>
  );
};
