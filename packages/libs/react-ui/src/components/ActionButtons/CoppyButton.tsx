import { copyButtonClass } from './CopyButton.css.ts';

import type { SystemIcon } from '@components/Icon';
import { IconButton } from '@components/IconButton';
import type { FC } from 'react';
import React, { useState } from 'react';

const COPY_DURATION_TIME: number = 1000;

export interface ICopyButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'color' | 'className'
  > {
  value: string;
  icon: keyof typeof SystemIcon;
}

export const CopyButton: FC<ICopyButtonProps> = ({
  value,
  icon,
  ...restProps
}) => {
  const [click, setClick] = useState<boolean>(false);

  const handleClick = async (): Promise<void> => {
    await navigator.clipboard.writeText(value);
    setClick(true);
    setTimeout(() => {
      setClick(false);
    }, COPY_DURATION_TIME);
  };

  return (
    <div className={copyButtonClass}>
      <IconButton
        {...restProps}
        color={'primary'}
        icon={click ? successIcon : icon}
        onClick={handleClick}
        title={'ContentCopy'}
      />
    </div>
  );
};
