import { SystemIcons } from '@kadena/react-components';

import { HamburgerButton } from './styles';

import React, { type FC } from 'react';

interface IProps {
  toggleAside: () => void;
  isAsideOpen: boolean;
}

export const AsideToggle: FC<IProps> = ({ toggleAside, isAsideOpen }) => {
  return (
    <HamburgerButton
      title="Open the code"
      onClick={toggleAside}
      icon={isAsideOpen ? SystemIcons.Close : SystemIcons.Code}
      color="inverted"
    />
  );
};
