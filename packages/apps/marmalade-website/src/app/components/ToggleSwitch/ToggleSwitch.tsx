'use client';
import styles from './toggle-switch.module.scss';

import React, { FC } from 'react';

export interface ISwitchProps {
  name: string;
  isChecked: boolean;
  onSwitchChange: (isChecked: boolean) => void;
  disabled?: boolean;
}

export const ToggleSwitch: React.FC<ISwitchProps> = (props: ISwitchProps) => {

  // for the accessability enable switch toggle by keyboard
  function onKeyDown(e: React.KeyboardEvent<HTMLLabelElement>) {
    if (e.code !== 'Space') return;
    e.preventDefault();
    props.onSwitchChange(!props.isChecked)
  }

  return (
    <label 
      htmlFor={props.name}
      className={`${styles.switch} ${props.isChecked ? styles['checked'] : ''}`}
      tabIndex={ props.disabled ? -1 : 0 }
      onKeyDown={ e => onKeyDown(e) }
    >
      <input
        type="checkbox"
        role="switch"
        id={props.name}
        name={props.name}
        checked={props.isChecked}
        aria-checked={props.isChecked}
        onChange={e => props.onSwitchChange(e.target.checked)}
        disabled={props.disabled}
        className={styles['switch-input']}
      />
    </label>
  );
};