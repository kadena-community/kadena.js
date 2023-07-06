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
  startUnmaskedValues?: number;
  endUnmaskedValues?: number;
}

export const MaskedValue: FC<IMaskedValueProps> = ({
  title,
  value,
  defaultVisibility = false,
  startUnmaskedValues = 6,
  endUnmaskedValues = 4,
}): JSX.Element => {
  const [visible, setVisible] = useState(defaultVisibility);

  const toggleVisibility = (): void => {
    setVisible(!visible);
  };

  return (
    <div className={classNames(containerClass)} data-testid="kda-masked-value">
      <div className={classNames(titleContainer)}>{title}</div>
      <div className={classNames(valueIconContainer)}>
        <div className={classNames(valueContainer)}>
          {visible
            ? value
            : `${value.slice(0, startUnmaskedValues)}****${value.slice(
                -endUnmaskedValues,
              )}`}
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
