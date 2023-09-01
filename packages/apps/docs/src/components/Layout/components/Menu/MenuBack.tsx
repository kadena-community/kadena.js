import { menuBackClass, menuBackOpenVariants } from './menu.css';

import classNames from 'classnames';
import React, { type FC } from 'react';

interface IProps {
  isOpen?: boolean;
  onClick: () => void;
}

export const MenuBack: FC<IProps> = ({ isOpen = false, onClick }) => {
  const classes = classNames(
    menuBackClass,
    menuBackOpenVariants[isOpen ? 'isOpen' : 'isClosed'],
  );

  return <button type="button" className={classes} onClick={onClick} />;
};
