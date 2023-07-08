import React from 'react';
import { Text, useFocus, useInput } from 'ink';

interface ToggleProps {
  value: string;
  values: string[];
  onChange: (value: string) => void;
  autoFocus?: boolean;
}

interface ToggleBooleanProps {
  value: boolean;
  onChange: (value: boolean) => void;
  autoFocus?: boolean;
}

export const Toggle = (options: ToggleProps) => {
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

export const ToggleBoolean = (options: ToggleBooleanProps) => {
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
