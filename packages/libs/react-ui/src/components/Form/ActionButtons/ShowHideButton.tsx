import { SystemIcon } from '@components/Icon';
import type { FC } from 'react';
import React, { useState } from 'react';
import { buttonClass } from './CopyButton.css';

export interface IShowHideButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'color' | 'className'
  > {
  value: string;
  isText: boolean;
  setIsTextType: (isText: boolean) => void;
}

export const ShowHideButton: FC<IShowHideButtonProps> = ({
  value,
  isText,
  setIsTextType,
  ...restProps
}) => {
  const [click, setClick] = useState<boolean>(true);

  const handleClick = async (): Promise<void> => {
    setClick(!click);
    setIsTextType(!isText);
  };

  const EyeIcon = SystemIcon.Eye;
  const EyeOffOutlineIcon = SystemIcon.EyeOffOutline;

  return (
    <button
      {...restProps}
      aria-label={'ContentCopy'}
      onClick={handleClick}
      className={buttonClass}
    >
      {click ? <EyeIcon size="sm" /> : <EyeOffOutlineIcon size="sm" />}
    </button>
  );
};
