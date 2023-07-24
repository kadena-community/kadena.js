import { SystemIcon, Tooltip } from '@kadena/react-ui';

import { gridMiniMenuListButtonStyle } from './styles.css';

import classNames from 'classnames';
import React, { FC, useRef } from 'react';
import { ButtonHTMLAttributes } from 'react/index';

export interface IMenuButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  active?: boolean;
  icon: (typeof SystemIcon)[keyof typeof SystemIcon];
}

export const MenuButton: FC<IMenuButtonProps> = ({
  active,
  title,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  icon: Icon,
  ...rest
}) => {
  // eslint-disable-next-line
  // @ts-ignore
  const tooltipRef = useRef<HTMLDivElement>(null);
  return (
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
};
