import {
  inputStyle,
  labelStyle,
  spanStyle,
  strongStyle,
} from '@/components/Global/Toggle/styles.css';
import classNames from 'classnames';
import React, { useState } from 'react';

export const Toggle = (
  label: string,
  toggled: boolean,
  onClick: (arg0: boolean) => void,
) => {
  const [isToggled, toggle] = useState(toggled);

  const callback = () => {
    toggle(!isToggled);
    onClick(!isToggled);
  };

  return (
    <label className={labelStyle}>
      <input
        type="checkbox"
        defaultChecked={isToggled}
        onClick={callback}
        className={inputStyle}
        aria-label={'toggle'}
      />
      <span className={classNames(spanStyle, { isToggled })} />
      <strong className={strongStyle}>{label}</strong>
    </label>
  );
};
