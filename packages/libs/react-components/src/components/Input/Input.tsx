import { SystemIcons } from '../Icons';

import {
  StyledIconWrapper,
  StyledInput,
  StyledInputWrapper,
  StyledLeadingText,
} from './styles';

import React, { FC } from 'react';

export interface IInputProps
  extends Omit<
    React.HTMLAttributes<HTMLInputElement>,
    'as' | 'disabled' | 'children' | 'className'
  > {
  as?: 'input';
  leadingText?: string;
  leftPanel?: typeof SystemIcons[keyof typeof SystemIcons];
  rightPanel?: typeof SystemIcons[keyof typeof SystemIcons];
  disabled?: boolean;
  status?: 'success' | 'error';
}

export const Input: FC<IInputProps> = ({
  leadingText,
  leftPanel,
  rightPanel,
  status,
  disabled = false,
  ...rest
}) => {
  const RightPanel = rightPanel;
  const LeftPanel = leftPanel;
  const variant = disabled ? 'disabled' : status;

  return (
    <StyledInputWrapper {...rest} variant={variant}>
      {Boolean(leadingText) && (
        <StyledLeadingText>{leadingText}</StyledLeadingText>
      )}
      {LeftPanel && (
        <StyledIconWrapper>
          <LeftPanel size="md" />
        </StyledIconWrapper>
      )}
      <StyledInput variant={variant} disabled={disabled} {...rest} />
      {RightPanel && (
        <StyledIconWrapper>
          <RightPanel size="md" />
        </StyledIconWrapper>
      )}
    </StyledInputWrapper>
  );
};
