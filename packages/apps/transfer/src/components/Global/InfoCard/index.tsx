import { FC } from 'react';
import {
  StyledInfoContainer,
  StyledInfoItem,
  StyledInfoItemLine,
  StyledInfoItemTitle,
} from './styles';
import { AccountText } from '../AccountText';

export interface IInfoCardProps {
  firstTitle: string;
  account: string;
  secondTitle: string;
  secondContent: string;
}

export const InfoCard: FC<IInfoCardProps> = ({
  firstTitle,
  account,
  secondTitle,
  secondContent,
}) => {
  return (
    <StyledInfoItem>
      <div>{/* <StyledSmallFromAccount /> */}</div>
      <StyledInfoContainer>
        <AccountText
          title={firstTitle}
          account={account}
          defaultVisibility={true}
        />
        {/* <StyledInfoItemTitle>{firstTitle}</StyledInfoItemTitle>
        <StyledInfoItemLine>{account}</StyledInfoItemLine> */}
        <div>
          <StyledInfoItemTitle>{secondTitle}</StyledInfoItemTitle>
          <StyledInfoItemLine>{secondContent}</StyledInfoItemLine>
        </div>
      </StyledInfoContainer>
    </StyledInfoItem>
  );
};
