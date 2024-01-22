import type { FC } from 'react';
import React, { useState } from 'react';
import { CopyButton } from '../../ActionButtons/CopyButton';
import type { IInputProps } from '../Input';
import { Input } from '../Input';

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
