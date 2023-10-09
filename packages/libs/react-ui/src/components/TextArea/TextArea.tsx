import { CopyButton } from './CopyButton';
import {
  containerClass,
  disabledClass,
  inputClass,
  inputContainerClass,
  outlinedClass,
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
  outlined?: boolean;
  hasCopyButton?: boolean;
}

export const Textarea: FC<ITextareaProps> = forwardRef<
  HTMLTextAreaElement,
  ITextareaProps
>(function TextArea(
  { outlined, hasCopyButton = false, disabled = false, fontFamily, ...rest },
  ref,
) {
  const [value, setValue] = useState<string>('');

  const handleValueChange = ({
    target,
  }: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setValue(target.value);
  };

  return (
    <div
      className={classNames(containerClass, {
        [outlinedClass]: outlined,
        [disabledClass]: disabled,
      })}
      data-testid="kda-textarea"
    >
      <div className={inputContainerClass}>
        <textarea
          ref={ref}
          className={classNames(inputClass, sprinkles({ fontFamily }))}
          disabled={disabled}
          onChange={handleValueChange}
          value={value}
          {...rest}
        />
        <CopyButton shouldShow={hasCopyButton} value={value} />
      </div>
    </div>
  );
});
