import type { ITextareaProps } from '@components/Form';
import { CopyButton, Textarea } from '@components/Form';
import type { FC } from 'react';
import React, { useState } from 'react';

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
