import { FC } from 'react';
import {
  StyledContentContainer,
  StyledInfoContainer,
  StyledInfoItem,
  StyledInfoItemLine,
  StyledInfoItemTitle,
  StyledWarningContainer,
} from './styles';
import { AccountText } from '../AccountText';

export interface IDetailCardProps {
  firstTitle: string;
  firstContent: string;
  isAccount?: boolean;
  secondTitle: string;
  secondContent: string;
  icon: JSX.Element;
}

export const DetailCard: FC<IDetailCardProps> = ({
  firstTitle,
  firstContent,
  secondTitle,
  secondContent,
  icon,
  isAccount = true,
}) => {
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
          <StyledWarningContainer>
            This is a cross-chain transaction because the receiver chain 2 is
            set.
          </StyledWarningContainer>
        </StyledContentContainer>
      </StyledInfoContainer>
    </StyledInfoItem>
  );
};
