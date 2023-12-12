import type { IInputProps } from '@components/Form';
import { Input, ShowHideButton } from '@components/Form';
import type { FC } from 'react';
import React, { useState } from 'react';

export const InputShowHide: FC<IInputProps> = (props) => {
  const [value, setValue] = useState<string>('');
  const [isText, setIsTextType] = useState<boolean>(false);
  return (
    <Input
      {...props}
      type={isText ? 'text' : 'password'}
      value={value}
      onChange={({ target }) => setValue(target.value)}
    >
      <ShowHideButton
        isText={isText}
        setIsTextType={setIsTextType}
        value={value}
      />
    </Input>
  );
};
