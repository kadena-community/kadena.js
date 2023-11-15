import { SystemIcon } from '@components/Icon';
import type { FC } from 'react';
import React, { useState } from 'react';

const COPY_DURATION_TIME: number = 1000;

export interface ICopyButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'color' | 'className'
  > {
  value: string;
}

export const CopyButton: FC<ICopyButtonProps> = ({ value, ...restProps }) => {
  const [click, setClick] = useState<boolean>(false);

  const handleClick = async (): Promise<void> => {
    await navigator.clipboard.writeText(value);
    setClick(true);
    setTimeout(() => {
      setClick(false);
    }, COPY_DURATION_TIME);
  };

  const CheckIcon = SystemIcon.Check;
  const ContentCopyIcon = SystemIcon.ContentCopy;

  return (
    <button {...restProps} aria-label={'ContentCopy'} onClick={handleClick}>
      {click ? <CheckIcon size="md" /> : <ContentCopyIcon size="md" />}
    </button>
  );
};
