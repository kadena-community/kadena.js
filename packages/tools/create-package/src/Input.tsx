import { Text, useFocus } from 'ink';
import TextInput, { type Props } from 'ink-text-input';
import type { FC } from 'react';
import React from 'react';

type InputProps = Props & { autoFocus?: boolean };

export const Input: FC<InputProps> = ({ autoFocus, value, onChange }) => {
  const { isFocused } = useFocus({ autoFocus });
  return (
    <Text color={isFocused ? 'green' : 'white'}>
      <TextInput focus={isFocused} value={value} onChange={onChange} />
    </Text>
  );
};
