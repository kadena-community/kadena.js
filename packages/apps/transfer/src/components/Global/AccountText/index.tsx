import { FC, useState } from 'react';
import {
  StyledAccountContainer,
  StyledAccountNo,
  StyledAccountText,
  StyledEyeIcon,
  StyledEyeOffIcon,
  StyledTitle,
} from './styles';

export interface IAccountTextProps {
  title: string;
  account: string;
  defaultVisibility?: boolean;
}

export const AccountText: FC<IAccountTextProps> = ({
  title,
  account,
  defaultVisibility = false,
}) => {
  const [visible, setVisible] = useState(defaultVisibility);

  const hiddenAccountValue = account.slice(0, 6) + '****' + account.slice(-4);

  const toogleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <StyledAccountText>
      <StyledTitle>{title}</StyledTitle>
      <StyledAccountContainer>
        <StyledAccountNo>
          {visible ? account : hiddenAccountValue}
        </StyledAccountNo>
        {visible ? (
          <StyledEyeOffIcon onClick={toogleVisibility} />
        ) : (
          <StyledEyeIcon onClick={toogleVisibility} />
        )}
      </StyledAccountContainer>
    </StyledAccountText>
  );
};
