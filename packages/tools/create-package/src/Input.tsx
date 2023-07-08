import React from 'react';
import { Text, useFocus } from 'ink';
import TextInput, { type Props } from 'ink-text-input';

type InputProps = Props & { autoFocus?: boolean };

export const Input = ({ autoFocus, value, onChange }: InputProps) => {
  const { isFocused } = useFocus({ autoFocus });
  return (
    <Text color={isFocused ? 'green' : 'white'}>
      <TextInput focus={isFocused} value={value} onChange={onChange} />
    </Text>
  );
};
