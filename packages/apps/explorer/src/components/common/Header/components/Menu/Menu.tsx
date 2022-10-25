import GlobalDropdown from '../../../GlobalDropdown/GlobalDropdown';
import ArrowIcon from '../../../GlobalIcons/ArrowIcon';

import s from './Menu.module.css';

import React, { FC } from 'react';
import { useMenu } from 'utils/hooks';

interface IProps {
  onItemClick: () => void;
}

const Menu: FC<IProps> = ({ onItemClick }) => {
  const { openedTab, setOpenedTab, componentInfo, network } = useMenu();
  const { Component, props: componentProps } = componentInfo;

  return (
    <div className={s.menuContainer}>
      <div className={s.menu}>
        <a
          className={`${s.block} ${openedTab === 'about' ? s.active : ''}`}
          onClick={(e) => {
            setOpenedTab((prev) => (prev === 'about' ? '' : 'about'));
            e.stopPropagation();
            onItemClick();
          }}
        >
          ABOUT
          {openedTab === 'about' ? (
            <ArrowIcon height="8" width="8" fill="rgb(0 0 0 / 50%)" />
          ) : (
            <ArrowIcon height="8" width="8" fill="#FFF" />
          )}
        </a>
        <a
          className={`${s.block} ${openedTab === 'getStarted' ? s.active : ''}`}
          onClick={(e) => {
            setOpenedTab((prev) => (prev === 'getStarted' ? '' : 'getStarted'));
            e.stopPropagation();
            onItemClick();
          }}
        >
          GET STARTED
          {openedTab === 'getStarted' ? (
            <ArrowIcon height="8" width="8" fill="rgb(0 0 0 / 50%)" />
          ) : (
            <ArrowIcon height="8" width="8" fill="#FFF" />
          )}
        </a>
        <a
          className={`${s.block} ${openedTab === 'learnMore' ? s.active : ''}`}
          onClick={(e) => {
            setOpenedTab((prev) => (prev === 'learnMore' ? '' : 'learnMore'));
            e.stopPropagation();
            onItemClick();
          }}
        >
          LEARN MORE
          {openedTab === 'learnMore' ? (
            <ArrowIcon height="8" width="8" fill="rgb(0 0 0 / 50%)" />
          ) : (
            <ArrowIcon height="8" width="8" fill="#FFF" />
          )}
        </a>
        <a
          className={`${s.block} ${openedTab === 'network' ? s.active : ''}`}
          onClick={(e) => {
            setOpenedTab((prev) => (prev === 'network' ? '' : 'network'));
            e.stopPropagation();
            onItemClick();
          }}
        >
          {network}
          {openedTab === 'network' ? (
            <ArrowIcon height="8" width="8" fill="rgb(0 0 0 / 50%)" />
          ) : (
            <ArrowIcon height="8" width="8" fill="#FFF" />
          )}
        </a>
        {openedTab && (
          <GlobalDropdown setOpenedTab={setOpenedTab}>
            <Component {...componentProps} />
          </GlobalDropdown>
        )}
      </div>
    </div>
  );
};

export default Menu;
