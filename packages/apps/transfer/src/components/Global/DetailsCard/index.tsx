import { FC } from 'react';
import {
  StyledInfoContainer,
  StyledInfoItem,
  StyledInfoItemLine,
  StyledInfoItemTitle,
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
        <div>
          <StyledInfoItemTitle>{secondTitle}</StyledInfoItemTitle>
          <StyledInfoItemLine>{secondContent}</StyledInfoItemLine>
        </div>
      </StyledInfoContainer>
    </StyledInfoItem>
  );
};
