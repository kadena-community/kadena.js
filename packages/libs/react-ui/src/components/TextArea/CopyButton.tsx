import { copyButtonClass } from './TextArea.css';

import { IconButton } from '@components/IconButton';
import type { FC } from 'react';
import React, { useState } from 'react';

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
    }, 1000);
  };

  return (
    shouldShow && (
      <>
        <div className={copyButtonClass}>
          <IconButton
            color={'primary'}
            icon={copied ? 'Check' : 'ContentCopy'}
            onClick={handleClick}
            title={'ContentCopy'}
            {...restProps}
          />
        </div>
      </>
    )
  );
};
