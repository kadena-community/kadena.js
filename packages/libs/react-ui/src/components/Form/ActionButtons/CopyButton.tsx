import type { ComponentProps, FC } from 'react';
import React, { useRef } from 'react';
import { useAsyncFn } from '../../../utils/useAsyncFn';
import { Check, ContentCopy } from '../../Icon/System/SystemIcon';
import { buttonClass } from './CopyButton.css';

export interface ICopyButtonProps
  extends Omit<ComponentProps<'button'>, 'color' | 'className'> {
  inputId: string;
}

export const CopyButton: FC<ICopyButtonProps> = ({ inputId, ...restProps }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [{ isSuccess }, copy] = useAsyncFn(async () => {
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (input) {
      input.focus();
      input.select();
      await navigator.clipboard.writeText(input.value);
    }
  }, []);

  return (
    <button
      {...restProps}
      ref={ref}
      aria-label="Copy to clipboard"
      onClick={copy}
      className={buttonClass}
    >
      {isSuccess ? <Check size="sm" /> : <ContentCopy size="sm" />}
    </button>
  );
};
