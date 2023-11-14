import type { IInputProps } from '@components/Form';
import { CopyButton, Input } from '@components/Form';
import type { FC } from 'react';
import React, { useState } from 'react';

export const InputCopy: FC<IInputProps> = (props) => {
  const [value, setValue] = useState<string>('');
  return (
    <Input
      {...props}
      value={value}
      onChange={({ target }) => setValue(target.value)}
    >
      <CopyButton value={value} />
    </Input>
  );
};
