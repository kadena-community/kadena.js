import { SystemIcons } from '@kadena/react-components';
import { FC, useState } from 'react';
import {
  StyledAccountContainer,
  StyledAccountNo,
  StyledEyeIcon,
  StyledEyeOffIcon,
  StyledTitle,
} from './style';

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
  const [visible, setVisible] = useState<boolean>(defaultVisibility);

  const hiddenAccountValue = account.slice(0, 6) + '****' + account.slice(-4);

  return (
    <div>
      <StyledTitle>{title}</StyledTitle>
      <StyledAccountContainer>
        <StyledAccountNo>
          {defaultVisibility ? account : hiddenAccountValue}
        </StyledAccountNo>
        {defaultVisibility ? <StyledEyeOffIcon /> : <StyledEyeIcon />}
      </StyledAccountContainer>
    </div>
  );
};
