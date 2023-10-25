import { EVENT_NAMES, analyticsEvent } from '@/utils/analytics';
import { SystemIcon } from '@kadena/react-ui';
import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';
import { hamburgerButtonClass, headerButtonClass } from './styles.css';

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
      className={classNames(hamburgerButtonClass, headerButtonClass)}
      data-cy="hamburgermenu"
      title="Open the sidemenu"
      onClick={onToggleMenu}
    >
      {isMenuOpen ? <SystemIcon.Close /> : <SystemIcon.MenuOpen />}
    </button>
  );
};
