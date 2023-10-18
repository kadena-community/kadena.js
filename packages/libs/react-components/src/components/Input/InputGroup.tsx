import type { FC } from 'react';
import React from 'react';
import { AlertBox } from '../Icons/svgs/AlertBox';
import { AlertCircleOutline } from '../Icons/svgs/AlertCircleOutline';
import {
  StyledHelper,
  StyledInfo,
  StyledInputGroupHeader,
  StyledInputGroupWrapper,
  StyledInputs,
  StyledTag,
  StyledText,
} from './styles';

export interface IInputGroupProps {
  label?: string;
  tag?: string;
  info?: string;
  helper?: string;
  status?: 'success' | 'error';
  disabled?: boolean;
  children: React.ReactNode;
}

export const InputGroup: FC<IInputGroupProps> = ({
  label,
  tag,
  info,
  helper,
  children,
  status,
  disabled = false,
}) => {
  const hasHeader = Boolean(label) || Boolean(tag) || Boolean(info);
  const variant = disabled ? 'disabled' : status;

  return (
    <StyledInputGroupWrapper variant={variant}>
      {hasHeader && (
        <StyledInputGroupHeader>
          {Boolean(label) && (
            <StyledText as={'label'} variant={'label'} size={'md'}>
              {label}
            </StyledText>
          )}
          {Boolean(tag) && <StyledTag variant={variant}>{tag}</StyledTag>}
          {Boolean(info) && (
            <StyledInfo>
              <span>{info}</span>
              <AlertCircleOutline />
            </StyledInfo>
          )}
        </StyledInputGroupHeader>
      )}
      <StyledInputs>{children}</StyledInputs>
      {Boolean(helper) && (
        <StyledHelper variant={variant}>
          <AlertBox />
          <span>{helper}</span>
        </StyledHelper>
      )}
    </StyledInputGroupWrapper>
  );
};
