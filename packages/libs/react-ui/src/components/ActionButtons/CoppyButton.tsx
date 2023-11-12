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
  shouldShow: boolean;
  successIcon: keyof typeof SystemIcon;
  errorIcon: keyof typeof SystemIcon;
  icon: keyof typeof SystemIcon;
  onError?: () => void;
  onSuccess?: () => void;
}

export const CopyButton: FC<ICopyButtonProps> = ({
  shouldShow,
  value,
  successIcon,
  errorIcon,
  icon,
  onError,
  onSuccess,
  ...restProps
}) => {
  const [click, setClick] = useState<boolean>(false);

  const handleClick = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(value);

      onSuccess?.();
      setClick(true);
      setTimeout(() => {
        setClick(false);
      }, COPY_DURATION_TIME);
    } catch (error) {
      onError?.();
    }
  };

  return (
    shouldShow && (
      <div className={copyButtonClass}>
        <IconButton
          {...restProps}
          color={'primary'}
          icon={click ? successIcon : icon}
          onClick={handleClick}
          title={'ContentCopy'}
        />
      </div>
    )
  );
};
