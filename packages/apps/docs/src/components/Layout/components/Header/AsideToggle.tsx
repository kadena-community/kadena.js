import { SystemIcon } from '@kadena/react-ui';

import { HamburgerButton } from './styles';

import React, { FC } from 'react';

interface IProps {
  toggleAside: () => void;
  isAsideOpen: boolean;
}

export const AsideToggle: FC<IProps> = ({ toggleAside, isAsideOpen }) => {
  return (
    <HamburgerButton
      title="Open the code"
      onClick={toggleAside}
      icon={isAsideOpen ? SystemIcon.Close : SystemIcon.Code}
      color="inverted"
    />
  );
};
