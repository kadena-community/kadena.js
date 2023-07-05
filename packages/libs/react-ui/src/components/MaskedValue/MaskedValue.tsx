import { SystemIcon } from '../Icons';

import {
  containerClass,
  titleContainer,
  valueContainer,
  iconContainer,
  valueIconContainer,
} from './MaskedValue.css';

import classNames from 'classnames';
import React, { FC, useState } from 'react';

export interface IMaskedValueProps {
  title?: string;
  value: string;
  defaultVisibility?: boolean;
}

export const MaskedValue: FC<IMaskedValueProps> = ({
  title,
  value,
  defaultVisibility = false,
}): JSX.Element => {
  const [visible, setVisible] = useState(defaultVisibility);

  const hiddenAccountValue = `${value.slice(0, 6)}****${value.slice(-4)}`;

  const toggleVisibility = (): void => {
    setVisible(!visible);
  };

  return (
    <div className={classNames(containerClass)}>
      <div className={classNames(titleContainer)}>{title}</div>
      <div className={classNames(valueIconContainer)}>
        <div className={classNames(valueContainer)}>
          {visible ? value : hiddenAccountValue}
        </div>
        {visible ? (
          <SystemIcon.EyeOffOutline
            className={classNames(iconContainer)}
            onClick={toggleVisibility}
          />
        ) : (
          <SystemIcon.EyeOutline
            className={classNames(iconContainer)}
            onClick={toggleVisibility}
          />
        )}
      </div>
    </div>
  );
};
