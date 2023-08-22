'use client';

import {
  iconContainer,
  titleContainer,
  valueContainer,
  valueIconContainer,
} from './MaskedValue.css';

import { SystemIcon } from '@components/Icon';
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

  let maskedValue = value;

  // If the value size is shorter than the unmasked chars, we don't mask it
  if (startUnmaskedValues + endUnmaskedValues <= value.length - 1) {
    maskedValue = `${value.slice(0, startUnmaskedValues)}****${value.slice(
      -endUnmaskedValues,
    )}`;
  }

  return (
    <div data-testid="kda-masked-value">
      <div className={titleContainer}>{title}</div>
      <div className={valueIconContainer}>
        <div className={valueContainer}>{visible ? value : maskedValue}</div>
        {visible ? (
          <SystemIcon.EyeOffOutline
            className={iconContainer}
            onClick={toggleVisibility}
          />
        ) : (
          <SystemIcon.EyeOutline
            className={iconContainer}
            onClick={toggleVisibility}
          />
        )}
      </div>
    </div>
  );
};
