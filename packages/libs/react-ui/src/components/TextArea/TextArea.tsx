import {
  containerClass,
  disabledClass,
  textAreaClass,
  textAreaContainerClass,
} from './TextArea.css';

import type { Sprinkles } from '@theme/sprinkles.css';
import { sprinkles } from '@theme/sprinkles.css';
import classNames from 'classnames';
import type { FC, TextareaHTMLAttributes } from 'react';
import React, { forwardRef, useState } from 'react';

export interface ITextareaProps
  extends Omit<
      TextareaHTMLAttributes<HTMLTextAreaElement>,
      'as' | 'disabled' | 'children' | 'className' | 'id'
    >,
    Partial<Pick<Sprinkles, 'fontFamily'>> {
  disabled?: boolean;
  ref?: React.ForwardedRef<HTMLTextAreaElement>;
  id: string;
}

export const Textarea: FC<ITextareaProps> = forwardRef<
  HTMLTextAreaElement,
  ITextareaProps
>(function TextArea({ disabled = false, fontFamily, ...rest }, ref) {
  const [value, setValue] = useState<string>('');

  const handleValueChange = ({
    target,
  }: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setValue(target.value);
  };

  return (
    <div
      className={classNames(containerClass, {
        [disabledClass]: disabled,
      })}
    >
      <div className={textAreaContainerClass}>
        <textarea
          ref={ref}
          className={classNames(textAreaClass, sprinkles({ fontFamily }))}
          disabled={disabled}
          onChange={handleValueChange}
          value={value}
          {...rest}
        />
      </div>
    </div>
  );
});
