import { AlertBox } from '../Icons/svgs/AlertBox';
import { AlertCircleOutline } from '../Icons/svgs/AlertCircleOutline';
import { Text } from '../Typography';

import {
  StyledHelper,
  StyledInfo,
  StyledInputGroupHeader,
  StyledInputGroupWrapper,
  StyledInputs,
  StyledTag,
} from './styles';

import classnames from 'classnames';
import React, { FC } from 'react';

export interface IInputGroupProps {
  label?: string;
  tag?: string;
  info?: string;
  helper?: string;
  status?: 'success' | 'error';
  disabled?: boolean;
  children: React.ReactNode;
  className?: 'string';
}

export const InputGroup: FC<IInputGroupProps> = ({
  label,
  tag,
  info,
  helper,
  children,
  status,
  disabled,
  className = '',
}) => {
  const hasHeader = Boolean(label) || Boolean(tag) || Boolean(info);
  return (
    <StyledInputGroupWrapper className={classnames({ disabled }, className)}>
      {hasHeader && (
        <StyledInputGroupHeader>
          {Boolean(label) && (
            <Text as={'label'} variant={'label'} size={'md'}>
              {label}
            </Text>
          )}
          {Boolean(tag) && (
            <StyledTag className={classnames({ disabled })}>{tag}</StyledTag>
          )}
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
        <StyledHelper className={classnames({ disabled }, status)}>
          <AlertBox />
          <span>{helper}</span>
        </StyledHelper>
      )}
    </StyledInputGroupWrapper>
  );
};
