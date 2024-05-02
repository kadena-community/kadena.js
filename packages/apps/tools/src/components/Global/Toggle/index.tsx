import {
  inputStyle,
  labelStyle,
  spanStyle,
  strongStyle,
  toggleContainerStyle,
} from '@/components/Global/Toggle/styles.css';
import classNames from 'classnames';
import type { FC } from 'react';
import React, { useState } from 'react';

interface IToggleProps {
  label: string;
  toggled: boolean;
  onClick: (arg0: boolean) => void;
}
export const Toggle: FC<IToggleProps> = ({ toggled, label, onClick }) => {
  const [isToggled, toggle] = useState(toggled);

  const callback = () => {
    toggle(!isToggled);
    onClick(!isToggled);
  };

  return (
    <label className={toggleContainerStyle}>
      <span className={labelStyle}>
        <input
          type="checkbox"
          defaultChecked={isToggled}
          onClick={callback}
          className={inputStyle}
          aria-label={'toggle'}
        />
        <span className={classNames(spanStyle, { isToggled })} />
      </span>
      <strong className={strongStyle}>{label}</strong>
    </label>
  );
};
