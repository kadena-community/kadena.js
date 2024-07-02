import { MonoCheck, MonoContentCopy } from '@kadena/kode-icons/system';
import type { ComponentProps, FC } from 'react';
import React, { useRef } from 'react';
import { useAsyncFn } from '../../../utils/useAsyncFn';
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
      {isSuccess ? <MonoCheck /> : <MonoContentCopy />}
    </button>
  );
};
