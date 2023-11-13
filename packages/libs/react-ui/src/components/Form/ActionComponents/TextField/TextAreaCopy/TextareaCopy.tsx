import type { ITextareaProps } from '@components/Form';
import { Textarea } from '@components/Form';
import { CopyButton } from '@components/Form/ActionButtons/CopyButton';
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
