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
import React, { forwardRef } from 'react';

export interface ITextareaProps
  extends Omit<
      TextareaHTMLAttributes<HTMLTextAreaElement>,
      'as' | 'disabled' | 'children' | 'className' | 'id'
    >,
    Partial<Pick<Sprinkles, 'fontFamily'>> {
  id: string;
  disabled?: boolean;
  ref?: React.ForwardedRef<HTMLTextAreaElement>;
}

export const Textarea: FC<ITextareaProps> = forwardRef<
  HTMLTextAreaElement,
  ITextareaProps
>(function TextArea({ disabled = false, fontFamily, ...rest }, ref) {
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
          {...rest}
        />
      </div>
    </div>
  );
});
