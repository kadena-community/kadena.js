import { SystemIcons } from '@kadena/react-components';

import {
  StyledHelper,
  StyledIconWrapper,
  StyledInfo,
  StyledLeadingText,
  StyledSelect,
  StyledSelectGroupHeader,
  StyledSelectGroupWrapper,
  StyledSelects,
  StyledSelectWrapper,
  StyledTag,
  StyledText,
} from '@/components/Global/Select/styles';
import React, { ChangeEvent, FC } from 'react';

export interface ISelectProps {
  label?: string;
  tag?: string;
  info?: string;
  helper?: string;
  status?: 'success' | 'error';
  disabled?: boolean;
  children: React.ReactNode;
  value: string | number;
  as?: 'select';
  leadingText?: string;
  leftPanel?: (typeof SystemIcons)[keyof typeof SystemIcons];
  rightPanel?: (typeof SystemIcons)[keyof typeof SystemIcons];
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export const Select: FC<ISelectProps> = ({
  label,
  tag,
  info,
  helper,
  status,
  value,
  disabled = false,
  leadingText,
  leftPanel,
  rightPanel,
  onChange,
  ...rest
}) => {
  const hasHeader = Boolean(label) || Boolean(tag) || Boolean(info);
  const variant = disabled ? 'disabled' : status;
  const RightPanel = rightPanel;
  const LeftPanel = leftPanel;

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(event);
    }
  };
  return (
    <StyledSelectGroupWrapper variant={variant}>
      {hasHeader && (
        <StyledSelectGroupHeader>
          {Boolean(label) && (
            <StyledText as={'label'} variant={'label'} size={'md'}>
              {label}
            </StyledText>
          )}
          {Boolean(tag) && <StyledTag variant={variant}>{tag}</StyledTag>}
          {Boolean(info) && (
            <StyledInfo>
              <span>{info}</span>
              <SystemIcons.AlertCircleOutline />
            </StyledInfo>
          )}
        </StyledSelectGroupHeader>
      )}
      <StyledSelects>
        <StyledSelectWrapper variant={variant}>
          {Boolean(leadingText) && (
            <StyledLeadingText>{leadingText}</StyledLeadingText>
          )}
          {LeftPanel && (
            <StyledIconWrapper>
              <LeftPanel size="md" />
            </StyledIconWrapper>
          )}
          <StyledSelect
            variant={variant}
            disabled={disabled}
            onChange={handleSelectChange}
            value={value}
            {...rest}
          />
          {RightPanel && (
            <StyledIconWrapper>
              <RightPanel size="md" />
            </StyledIconWrapper>
          )}
        </StyledSelectWrapper>
      </StyledSelects>
      {Boolean(helper) && (
        <StyledHelper variant={variant}>
          <SystemIcons.AlertBox />
          <span>{helper}</span>
        </StyledHelper>
      )}
    </StyledSelectGroupWrapper>
  );
};
