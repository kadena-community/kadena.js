import { SystemIcons } from '../Icons';

import {
  StyledIconWrapper,
  StyledInput,
  StyledInputWrapper,
  StyledLeadingText,
} from './styles';

import classnames from 'classnames';
import React, { FC } from 'react';

export interface IInputProps
  extends Omit<
    React.HTMLAttributes<HTMLInputElement>,
    'as' | 'disabled' | 'children'
  > {
  as?: 'input';
  leftPanel?: typeof SystemIcons[keyof typeof SystemIcons] | string;
  rightPanel?: typeof SystemIcons[keyof typeof SystemIcons];
  disabled?: boolean;
  status?: 'success' | 'error';
}

export const Input: FC<IInputProps> = ({
  className,
  leftPanel: LeftPanel,
  rightPanel: RightPanel,
  status,
  disabled,
  ...rest
}) => {
  const hasLeadingText = typeof LeftPanel === 'string';
  return (
    <StyledInputWrapper
      {...rest}
      className={classnames({ disabled }, className, status)}
    >
      {LeftPanel &&
        (hasLeadingText ? (
          <StyledLeadingText>{LeftPanel}</StyledLeadingText>
        ) : (
          <StyledIconWrapper>
            <LeftPanel size="md" />
          </StyledIconWrapper>
        ))}
      <StyledInput
        className={classnames({ hasLeadingText })}
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
};
