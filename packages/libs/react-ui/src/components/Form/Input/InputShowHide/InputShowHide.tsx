import type { IInputProps } from '@components/Form';
import { Input, ShowHideButton } from '@components/Form';
import type { FC } from 'react';
import React, { useState } from 'react';

export const InputShowHide: FC<IInputProps> = (props) => {
  const [value, setValue] = useState<string>('');
  const [type, setType] = useState<'text' | 'password'>('text');
  return (
    <Input
      {...props}
      type={type}
      value={value}
      onChange={({ target }) => setValue(target.value)}
    >
      <ShowHideButton type={type} setType={setType} value={value} />
    </Input>
  );
};
