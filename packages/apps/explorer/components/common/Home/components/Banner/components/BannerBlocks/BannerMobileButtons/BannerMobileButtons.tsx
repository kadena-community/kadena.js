import React, { FC, memo } from 'react';
import ArrowIcon from '../../../../../../GlobalIcons/ArrowIcon';

import s from './BannerMobileButtons.module.css';

interface IProps {
  activeDropdown: boolean;
  setActiveDropdown: (val: boolean) => void;
  btnValue: string;
}
const BannerMobileButtons: FC<IProps> = ({
  activeDropdown,
  setActiveDropdown,
  btnValue,
}) => {
  return (
    <div className={s.buttonsContainer}>
      <button
        type="button"
        className={s.chartButton}
        onClick={e => {
          e.stopPropagation();
          setActiveDropdown(!activeDropdown);
          document.body.style.overflowY = 'hidden';
        }}>
        {btnValue}
      </button>
      <ArrowIcon height="8" width="8" fill="#C0FB50" />
    </div>
  );
};

export default memo(BannerMobileButtons);
