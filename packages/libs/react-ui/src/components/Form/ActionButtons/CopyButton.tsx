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

  return (
    <IconButton
      {...restProps}
      color={'primary'}
      icon={click ? 'Check' : 'ContentCopy'}
      onClick={handleClick}
      title={'ContentCopy'}
    />
  );
};
