import type { FC } from 'react';
import React from 'react';
import { AccountText } from '../AccountText';
import {
  StyledContentContainer,
  StyledInfoContainer,
  StyledInfoItem,
  StyledInfoItemLine,
  StyledInfoItemTitle,
  StyledWarningContainer,
} from './styles';

export interface IDetailCardProps {
  firstTitle: string;
  firstContent: string;
  isAccount?: boolean;
  secondTitle: string;
  secondContent: string;
  helperText?: string;
  helperTextType?: 'mild' | 'severe';
  icon: JSX.Element;
}

export const DetailCard: FC<IDetailCardProps> = ({
  firstTitle,
  firstContent,
  secondTitle,
  secondContent,
  icon,
  helperText,
  helperTextType = 'mild',
  isAccount = true,
}): JSX.Element => {
  return (
    <StyledInfoItem>
      {icon}
      <StyledInfoContainer>
        {isAccount ? (
          <AccountText title={firstTitle} account={firstContent} />
        ) : (
          <div>
            <StyledInfoItemTitle>{firstTitle}</StyledInfoItemTitle>
            <StyledInfoItemLine>{firstContent}</StyledInfoItemLine>
          </div>
        )}
        <StyledContentContainer>
          <div>
            <StyledInfoItemTitle>{secondTitle}</StyledInfoItemTitle>
            <StyledInfoItemLine>{secondContent}</StyledInfoItemLine>
          </div>
          {helperText ? (
            <StyledWarningContainer typedMessage={helperTextType}>
              {helperText}
            </StyledWarningContainer>
          ) : null}
        </StyledContentContainer>
      </StyledInfoContainer>
    </StyledInfoItem>
  );
};
