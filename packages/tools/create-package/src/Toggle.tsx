import { Text, useFocus, useInput } from 'ink';
import React, { type FC } from 'react';

interface IToggleProps {
  value: string;
  values: string[];
  onChange: (value: string) => void;
  autoFocus?: boolean;
}

interface IToggleBooleanProps {
  value: boolean;
  onChange: (value: boolean) => void;
  autoFocus?: boolean;
}

export const Toggle: FC<IToggleProps> = (options) => {
  const { value, values, onChange, autoFocus } = options;
  const { isFocused } = useFocus({ autoFocus });

  useInput((input, key) => {
    const index = values.indexOf(value);
    const size = values.length;
    if (isFocused && (key.leftArrow || key.rightArrow || input === ' ')) {
      onChange(values[(index + (!key.rightArrow ? 1 : -1) + size) % size]);
    }
  });

  return (
    <Text color={isFocused ? 'green' : 'white'}>
      <Text>{value}</Text>
    </Text>
  );
};

export const ToggleBoolean: FC<IToggleBooleanProps> = (options) => {
  const { value, onChange, autoFocus } = options;
  const { isFocused } = useFocus({ autoFocus });

  useInput((input, key) => {
    if (isFocused && (key.leftArrow || key.rightArrow || input === ' ')) {
      onChange(!value);
    }
  });

  return (
    <Text color={isFocused ? 'green' : 'white'}>
      <Text>{String(value)}</Text>
    </Text>
  );
};
