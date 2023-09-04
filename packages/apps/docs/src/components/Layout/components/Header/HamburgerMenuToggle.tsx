import { SystemIcon } from '@kadena/react-ui';

import { hamburgerButtonClass } from './styles.css';

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
    <button
      className={hamburgerButtonClass}
      data-cy="hamburgermenu"
      title="Open the sidemenu"
      onClick={onToggleMenu}
    >
      {isMenuOpen ? <SystemIcon.Close /> : <SystemIcon.MenuOpen />}
    </button>
  );
};
