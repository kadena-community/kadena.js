import {
  StyledAccountContainer,
  StyledAccountNo,
  StyledAccountText,
  StyledEyeIcon,
  StyledEyeOffIcon,
  StyledTitle,
} from './styles';

import React, { FC, useState } from 'react';

export interface IAccountTextProps {
  title: string;
  account: string;
  defaultVisibility?: boolean;
}

export const AccountText: FC<IAccountTextProps> = ({
  title,
  account,
  defaultVisibility = false,
}): JSX.Element => {
  const [visible, setVisible] = useState(defaultVisibility);

  const hiddenAccountValue = account.slice(0, 6) + '****' + account.slice(-4);

  const toogleVisibility = (): void => {
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
