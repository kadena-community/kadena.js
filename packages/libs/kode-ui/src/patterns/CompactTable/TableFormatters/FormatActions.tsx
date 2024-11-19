import type { ReactElement } from 'react';
import React from 'react';
import type { ICompactTableFormatterProps } from './types';

export interface IActionProps {
  trigger: ReactElement;
}

export const FormatActions = ({ trigger }: IActionProps) => {
  const Component = ({ value }: ICompactTableFormatterProps) => {
    return React.cloneElement(trigger, {
      ...trigger.props,
      onPress: () => trigger.props.onPress(value),
    });
  };
  return Component;
};
