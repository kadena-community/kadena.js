import { SystemIcons } from '@kadena/react-components';

import { HamburgerButton } from './styles';

import { analyticsEvent, EVENT_NAMES } from '@/utils/analytics';
import React, { FC } from 'react';

interface IProps {
  toggleMenu: () => void;
  isMenuOpen: boolean;
}

export const HamburgerMenuToggle: FC<IProps> = ({ toggleMenu, isMenuOpen }) => {
  const onToggleMenu = (): void => {
    if (!isMenuOpen) {
      analyticsEvent(EVENT_NAMES['click:mobile_menu_open']);
    }
    toggleMenu();
  };
  return (
    <HamburgerButton
      data-cy="hamburgermenu"
      title="Open the sidemenu"
      onClick={onToggleMenu}
      icon={isMenuOpen ? SystemIcons.Close : SystemIcons.MenuOpen}
      color="inverted"
    />
  );
};
