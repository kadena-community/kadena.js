import { copyButtonClass } from './CopyButton.css.ts';

import { IconButton } from '@components/IconButton';
import type { FC } from 'react';
import React, { useState } from 'react';

const COPY_DURATION_TIME: number = 1000;

export interface ICopyButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'color' | 'className'
  > {
  shouldShow: boolean;
  value: string;
}

export const CopyButton: FC<ICopyButtonProps> = ({
  shouldShow,
  value,
  ...restProps
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleClick = async (): Promise<void> => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, COPY_DURATION_TIME);
  };

  return (
    shouldShow && (
      <div className={copyButtonClass}>
        <IconButton
          color={'primary'}
          icon={copied ? 'Check' : 'ContentCopy'}
          onClick={handleClick}
          title={'ContentCopy'}
          id="kda-text-area-copy-button"
          {...restProps}
        />
      </div>
    )
  );
};
