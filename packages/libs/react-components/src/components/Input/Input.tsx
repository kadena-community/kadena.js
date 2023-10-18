import type { FC } from 'react';
import React, { forwardRef } from 'react';
import type { SystemIcons } from '../Icons';
import {
  StyledIconWrapper,
  StyledInput,
  StyledInputWrapper,
  StyledLeadingText,
} from './styles';

export interface IInputProps
  extends Omit<
    React.HTMLAttributes<HTMLInputElement>,
    'as' | 'disabled' | 'children' | 'className'
  > {
  as?: 'input';
  leadingText?: string;
  leftPanel?: (typeof SystemIcons)[keyof typeof SystemIcons];
  rightPanel?: (typeof SystemIcons)[keyof typeof SystemIcons];
  disabled?: boolean;
  value?: string | number;
  status?: 'success' | 'error';
  type?: string;
  ref?: React.ForwardedRef<HTMLInputElement>;
}

export const Input: FC<IInputProps> = forwardRef<HTMLInputElement, IInputProps>(
  function Input(
    { leadingText, leftPanel, rightPanel, status, disabled = false, ...rest },
    ref,
  ) {
    const RightPanel = rightPanel;
    const LeftPanel = leftPanel;
    const variant = disabled ? 'disabled' : status;

    return (
      <StyledInputWrapper variant={variant}>
        {Boolean(leadingText) && (
          <StyledLeadingText>{leadingText}</StyledLeadingText>
        )}
        {LeftPanel && (
          <StyledIconWrapper>
            <LeftPanel size="md" />
          </StyledIconWrapper>
        )}
        <StyledInput
          ref={ref}
          variant={variant}
          disabled={disabled}
          {...rest}
        />
        {RightPanel && (
          <StyledIconWrapper>
            <RightPanel size="md" />
          </StyledIconWrapper>
        )}
      </StyledInputWrapper>
    );
  },
);
