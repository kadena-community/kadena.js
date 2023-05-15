import { AlertBox } from '../Icons/svgs/AlertBox';
import { AlertCircleOutline } from '../Icons/svgs/AlertCircleOutline';

import {
  StyledHelper,
  StyledInfo,
  StyledInputGroupHeader,
  StyledInputGroupWrapper,
  StyledLabel,
  StyledTag,
} from './styles';

import classnames from 'classnames';
import React, { FC } from 'react';

export interface IInputGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'as'> {
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
  disabled,
  className,
  ...rest
}) => {
  return (
    <StyledInputGroupWrapper
      {...rest}
      className={classnames({ disabled }, className)}
    >
      {!!(label || tag || info) && (
        <StyledInputGroupHeader>
          {!!label && <StyledLabel>{label}</StyledLabel>}
          {!!tag && (
            <StyledTag className={classnames({ disabled })}>{tag}</StyledTag>
          )}
          {!!info && (
            <StyledInfo>
              <span>{info}</span>
              <AlertCircleOutline />
            </StyledInfo>
          )}
        </StyledInputGroupHeader>
      )}
      {children}
      {!!helper && (
        <StyledHelper className={classnames({ disabled }, status)}>
          <AlertBox />
          <span>{helper}</span>
        </StyledHelper>
      )}
    </StyledInputGroupWrapper>
  );
};
