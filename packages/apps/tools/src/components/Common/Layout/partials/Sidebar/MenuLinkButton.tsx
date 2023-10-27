import { Tooltip } from '@kadena/react-ui';
import classNames from 'classnames';
import Link from 'next/link';
import type { ButtonHTMLAttributes, FC } from 'react';
import React, { useRef } from 'react';
import { gridMiniMenuLinkButtonStyle } from './styles.css';

export interface IMenuLinkButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  href?: string;
  active?: boolean;
}

export const MenuLinkButton: FC<IMenuLinkButtonProps> = ({
  active,
  title,
  href,
  ...rest
}) => {
  // eslint-disable-next-line
  // @ts-ignore
  const tooltipRef = useRef<HTMLDivElement>(null);

  const button = (
    <>
      <button
        className={classNames(gridMiniMenuLinkButtonStyle, { active })}
        onMouseEnter={(e) => Tooltip.handler(e, tooltipRef)}
        onMouseLeave={(e) => Tooltip.handler(e, tooltipRef)}
        {...rest}
        aria-label={title}
      >
        {title}
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
