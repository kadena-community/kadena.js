import type { FC } from 'react';
import React, { useState } from 'react';
import { CopyButton } from '../../ActionButtons/CopyButton';
import type { ITextareaProps } from '../Textarea';
import { Textarea } from '../Textarea';

export const TextareaCopy: FC<ITextareaProps> = (props) => {
  const [value, setValue] = useState<string>('');

  return (
    <Textarea
      {...props}
      value={value}
      onChange={({ target }) => setValue(target.value)}
    >
      <CopyButton value={value} />
    </Textarea>
  );
};
